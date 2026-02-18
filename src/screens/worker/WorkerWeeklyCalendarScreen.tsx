import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import NoticeBoard from "../../components/common/NoticeBoard";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import WeeklySummary from "../../components/worker/weeklyCalendar/WeeklySummary";
import AddWorkRequestModal from "../../components/worker/weeklyCalendar/AddWorkRequestModal";
import { createCorrectionRequest } from "../../api/workerApi";
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
	const [addModalVisible, setAddModalVisible] = useState(false);

	const handleAddWorkSubmit = async (data: {
		contractId: number;
		requestedWorkDate: string;
		requestedStartTime: string;
		requestedEndTime: string;
		requestedBreakMinutes: number;
	}) => {
		try {
			await createCorrectionRequest({
				type: "CREATE",
				...data,
			});
			setAddModalVisible(false);
			Alert.alert("요청 완료", "근무 추가 요청이 전송되었습니다.");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "요청에 실패했습니다. 다시 시도해주세요.";
			Alert.alert("요청 실패", message);
		}
	};

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
					onPressAdd={() => setAddModalVisible(true)}
				/>

				<View style={styles.dashedLine} />

				<WeeklySummary summary={{ ...dummyWeeklySummary, weekLabel }} />
			</ScrollView>

			<AddWorkRequestModal
				visible={addModalVisible}
				onClose={() => setAddModalVisible(false)}
				onSubmit={handleAddWorkSubmit}
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
