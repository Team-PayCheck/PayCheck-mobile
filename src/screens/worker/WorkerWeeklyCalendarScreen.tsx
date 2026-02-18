import React, { useMemo } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import NoticeBoard from "../../components/common/NoticeBoard";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import WeeklySummary from "../../components/worker/weeklyCalendar/WeeklySummary";
import AddWorkRequestModal from "../../components/worker/weeklyCalendar/AddWorkRequestModal";
import WorkerCorrectionRequestModal from "../../components/worker/weeklyCalendar/WorkerCorrectionRequestModal";
import useCorrectionRequest from "../../hooks/worker/useCorrectionRequest";
import useWorkRecords from "../../hooks/worker/useWorkRecords";
import { colors } from "../../constants/colors";
import {
	getWeekTitle,
	getWeekDays,
	getWeekLabel,
	getWeekRange,
} from "../../utils/date";
import { dummyNotices } from "../../dummyData/workerWeeklyCalendar";

const WorkerWeeklyCalendarScreen: React.FC = () => {
	const today = new Date();
	const weekTitle = getWeekTitle(today);
	const weekDays = getWeekDays(today);
	const weekLabel = getWeekLabel(today);
	const { startDate, endDate } = useMemo(() => getWeekRange(today), []);

	const { works, isLoading } = useWorkRecords(startDate, endDate);

	const {
		correctionModalVisible,
		selectedWork,
		openCorrectionModal,
		closeCorrectionModal,
		handleCorrectionSubmit,
		addModalVisible,
		openAddModal,
		closeAddModal,
		handleAddWorkSubmit,
	} = useCorrectionRequest();

	// 주간 요약 계산
	const totalMinutes = works.reduce(
		(sum, w) => sum + w.totalWorkMinutes,
		0
	);
	const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
	const estimatedPay = works.reduce(
		(sum, w) => sum + (w.totalSalary ?? 0),
		0
	);

	return (
		<SafeAreaView style={styles.container}>
			<Header />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<WeeklyDateBar
					weekTitle={weekTitle}
					weekDays={weekDays}
				/>

				<NoticeBoard notices={dummyNotices} />

				{isLoading ? (
					<ActivityIndicator
						size="large"
						color={colors.primary}
						style={styles.loader}
					/>
				) : (
					<WorkListSection
						works={works}
						onPressAdd={openAddModal}
						onPressCorrectionRequest={openCorrectionModal}
					/>
				)}

				<View style={styles.dashedLine} />

				<WeeklySummary
					summary={{ weekLabel, totalHours, estimatedPay }}
				/>
			</ScrollView>

			<AddWorkRequestModal
				visible={addModalVisible}
				onClose={closeAddModal}
				onSubmit={handleAddWorkSubmit}
			/>

			<WorkerCorrectionRequestModal
				visible={correctionModalVisible}
				onClose={closeCorrectionModal}
				work={selectedWork}
				onSubmit={handleCorrectionSubmit}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 16,
		paddingHorizontal: 20,
		paddingBottom: 40,
		gap: 24,
	},
	dashedLine: {
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: colors.border,
	},
	loader: {
		paddingVertical: 40,
	},
});

export default WorkerWeeklyCalendarScreen;
