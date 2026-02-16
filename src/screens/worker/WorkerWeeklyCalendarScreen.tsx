import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import NoticeBoard from "../../components/common/NoticeBoard";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
import {
	dummyWeekDays,
	dummyWeekTitle,
	dummyNotices,
	dummyWorks,
} from "../../dummyData/workerWeeklyCalendar";

const WorkerWeeklyCalendarScreen: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<Header />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<WeeklyDateBar
					weekTitle={dummyWeekTitle}
					weekDays={dummyWeekDays}
				/>

				<NoticeBoard notices={dummyNotices} />

				<WorkListSection works={dummyWorks} />

				{/* Phase 5: WeeklySummary */}
				<View style={styles.placeholder}>
					<Text weight="Medium" style={styles.placeholderText}>
						주간 요약
					</Text>
				</View>
			</ScrollView>
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
	placeholder: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 16,
		padding: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	placeholderText: {
		fontSize: 14,
		color: colors.textMuted,
	},
});

export default WorkerWeeklyCalendarScreen;
