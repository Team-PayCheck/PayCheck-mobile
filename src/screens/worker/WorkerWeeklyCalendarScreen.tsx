import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import NoticeBoard from "../../components/common/NoticeBoard";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import WeeklySummary from "../../components/worker/weeklyCalendar/WeeklySummary";
import AddWorkRequestModal from "../../components/worker/weeklyCalendar/AddWorkRequestModal";
import WorkerCorrectionRequestModal from "../../components/worker/weeklyCalendar/WorkerCorrectionRequestModal";
import useCorrectionRequest from "../../hooks/worker/useCorrectionRequest";
import { colors } from "../../constants/colors";
import { getWeekTitle, getWeekDays, getWeekLabel } from "../../utils/date";
import {
	dummyNotices,
	dummyWorks,
	dummyWeeklySummary,
} from "../../dummyData/workerWeeklyCalendar";

const WorkerWeeklyCalendarScreen: React.FC = () => {
	const today = new Date();
	const weekTitle = getWeekTitle(today);
	const weekDays = getWeekDays(today);
	const weekLabel = getWeekLabel(today);

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

				<WorkListSection
					works={dummyWorks}
					onPressAdd={openAddModal}
					onPressCorrectionRequest={openCorrectionModal}
				/>

				<View style={styles.dashedLine} />

				<WeeklySummary summary={{ ...dummyWeeklySummary, weekLabel }} />
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
});

export default WorkerWeeklyCalendarScreen;
