import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import NoticeCreateModal from "../../components/common/notice/NoticeCreateModal";
import NoticeDetailSheet from "../../components/common/notice/NoticeDetailSheet";
import NoticeEditSheet from "../../components/common/notice/NoticeEditSheet";
import WorkListSection from "../../components/worker/weeklyCalendar/WorkListSection";
import WeeklySummary from "../../components/worker/weeklyCalendar/WeeklySummary";
import AddWorkRequestModal from "../../components/worker/weeklyCalendar/AddWorkRequestModal";
import WorkerCorrectionRequestModal from "../../components/worker/weeklyCalendar/WorkerCorrectionRequestModal";
import useCorrectionRequest from "../../hooks/worker/useCorrectionRequest";
import useWorkRecords from "../../hooks/worker/useWorkRecords";
import useWorkplaces from "../../hooks/worker/useWorkplaces";
import { useNotices } from "../../hooks/common/useNotices";
import { useLogoutHandler } from "../../hooks/common/useLogoutHandler";
import { colors } from "../../constants/colors";
import type { WeekDay } from "../../types/worker.types";
import type { NoticeCardItem } from "../../types/common/notice.types";
import {
	getWeekTitle,
	getWeekDays,
	getWeekLabel,
	getWeekRange,
} from "../../utils/date";

type Props = NativeStackScreenProps<WorkerStackParamList, "WorkerHomeMain">;

const WorkerWeeklyCalendarScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);
	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	// 근로자 근무지 조회 (공지 게시판용 workplaceId 확보)
	const { workplaces: workerWorkplaces, fetchWorkplaces } = useWorkplaces();

	useEffect(() => {
		fetchWorkplaces();
	}, []);

	const workerWorkplaceId = workerWorkplaces[0]?.workplaceId ?? null;

	// 공지 게시판
	const {
		notices,
		selectedNotice,
		isDetailLoading,
		fetchDetail,
		clearDetail,
		handleCreate: createNotice,
		handleUpdate: updateNotice,
		handleDelete: deleteNotice,
	} = useNotices(workerWorkplaceId);

	const [isNoticeCreateVisible, setIsNoticeCreateVisible] = useState(false);
	const [isNoticeDetailVisible, setIsNoticeDetailVisible] = useState(false);
	const [isNoticeEditVisible, setIsNoticeEditVisible] = useState(false);

	const handlePressNotice = useCallback(
		(notice: NoticeCardItem) => {
			fetchDetail(notice.id);
			setIsNoticeDetailVisible(true);
		},
		[fetchDetail]
	);

	const handleNoticeEdit = useCallback(() => {
		setIsNoticeDetailVisible(false);
		setTimeout(() => setIsNoticeEditVisible(true), 250);
	}, []);

	const handleNoticeDelete = useCallback(
		async (noticeId: number) => {
			const success = await deleteNotice(noticeId);
			if (success) {
				setIsNoticeDetailVisible(false);
				clearDetail();
			}
		},
		[deleteNotice, clearDetail]
	);

	const today = new Date();
	const weekTitle = getWeekTitle(today);
	const baseWeekDays = getWeekDays(today);
	const weekLabel = getWeekLabel(today);
	const { startDate, endDate } = useMemo(() => getWeekRange(today), []);

	const { works, isLoading } = useWorkRecords(startDate, endDate);

	// 근무 데이터를 날짜 카드에 매핑
	const weekDays = useMemo(() => {
		const workDateMap = new Map<number, string>();
		works.forEach((w) => {
			const date = new Date(`${w.workDate}T00:00:00`).getDate();
			workDateMap.set(date, w.status);
		});
		return baseWeekDays.map((day) => ({
			...day,
			workStatus: workDateMap.get(day.date) as WeekDay["workStatus"],
		}));
	}, [baseWeekDays, works]);

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

				<NoticeBoard
				notices={notices}
				onPressAdd={() => setIsNoticeCreateVisible(true)}
				onPressNotice={handlePressNotice}
			/>

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
					onPressNotificationSettings={() => navigateFromDrawer("NotificationSettings")}
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

			{/* 공지 작성 모달 */}
			<NoticeCreateModal
				visible={isNoticeCreateVisible}
				onClose={() => setIsNoticeCreateVisible(false)}
				onSubmit={createNotice}
			/>

			{/* 공지 상세 바텀시트 */}
			<NoticeDetailSheet
				visible={isNoticeDetailVisible}
				onClose={() => {
					setIsNoticeDetailVisible(false);
					clearDetail();
				}}
				notice={selectedNotice}
				isLoading={isDetailLoading}
				onPressEdit={handleNoticeEdit}
				onPressDelete={handleNoticeDelete}
			/>

			{/* 공지 수정 바텀시트 */}
			<NoticeEditSheet
				visible={isNoticeEditVisible}
				onClose={() => {
					setIsNoticeEditVisible(false);
					clearDetail();
				}}
				notice={selectedNotice}
				onSubmit={updateNotice}
				onDelete={deleteNotice}
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
