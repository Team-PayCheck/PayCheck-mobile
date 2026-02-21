import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import { Text } from "../../components/common/Text";
import AccountTermsContent from "../../components/mypage/AccountTermsContent";
import { WorkerStackParamList } from "../../navigation/WorkerStack";
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

type Props = NativeStackScreenProps<WorkerStackParamList, "WorkerHomeMain">;

const WorkerWeeklyCalendarScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);
	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const { useLogoutHandler } = require("../../hooks/common/useLogoutHandler");
	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	
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
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
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
			

				<MyPageDrawer
					visible={isDrawerVisible}
					onClose={closeDrawer}
					onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
					onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
					onPressSentRequests={() => navigateFromDrawer("SentRequests")}
					onPressAccountSettings={() => {
						setIsDrawerVisible(false);
						setTimeout(() => setIsAccountSheetVisible(true), 220);
					}}
					onPressLogout={handleLogout}
					onPressWithdraw={() => navigateFromDrawer("Withdraw")}
				/>

				<BottomSheetModal
					visible={isAccountSheetVisible}
					onClose={() => setIsAccountSheetVisible(false)}
				>
					<AccountTermsContent />
				</BottomSheetModal>

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
