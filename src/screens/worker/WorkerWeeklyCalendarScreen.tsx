import React, { useState } from "react";
import { Alert, StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../navigation/WorkerStack";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import NoticeBoard from "../../components/common/NoticeBoard";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import WeeklySummary from "../../components/worker/weeklyCalendar/WeeklySummary";
import { colors } from "../../constants/colors";
import {
	dummyWeekDays,
	dummyWeekTitle,
	dummyNotices,
	dummyWorks,
	dummyWeeklySummary,
} from "../../dummyData/workerWeeklyCalendar";

type Props = NativeStackScreenProps<WorkerStackParamList, "WorkerHomeMain">;

const WorkerWeeklyCalendarScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const { useLogoutHandler } = require("../../hooks/common/useLogoutHandler");
	const handleLogout = useLogoutHandler(closeDrawer);
	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
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

				<View style={styles.dashedLine} />

				<WeeklySummary summary={dummyWeeklySummary} />
			</ScrollView>
			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
				onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
				onPressLogout={handleLogout}
				onPressWithdraw={() => navigateFromDrawer("Withdraw")}
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
