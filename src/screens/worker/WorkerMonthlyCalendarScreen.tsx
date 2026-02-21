import React, { useState, useMemo } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import type { WorkItem } from "../../types/worker.types";
import SelectedDateWorkList from "../../components/worker/monthlyCalendar/SelectedDateWorkList";
import MonthlySalarySummary from "../../components/worker/monthlyCalendar/MonthlySalarySummary";
import WorkplaceSalarySummary from "../../components/worker/monthlyCalendar/WorkplaceSalarySummary";
import { workplaceSalaryList } from "../../dummyData/workerMonthlyCalendar";
import AddWorkRequestModal from "../../components/worker/weeklyCalendar/AddWorkRequestModal";
import WorkerCorrectionRequestModal from "../../components/worker/weeklyCalendar/WorkerCorrectionRequestModal";
import useWorkRecords from "../../hooks/worker/useWorkRecords";
import useCorrectionRequest from "../../hooks/worker/useCorrectionRequest";
import { useLogoutHandler } from "../../hooks/common/useLogoutHandler";
import { WorkerStackParamList } from "../../navigation/WorkerStack";
import { colors } from "../../constants/colors";

const WorkerMonthlyCalendarScreen: React.FC = ({ navigation }: any) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const closeDrawer = () => setIsDrawerVisible(false);
  const openDrawer = () => setIsDrawerVisible(true);

  // Drawer 내비게이션 핸들러
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 월의 시작일/마지막일 계산
  const { startDate, endDate } = useMemo(() => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return {
      startDate: `${year}-${String(month + 1).padStart(2, "0")}-01`,
      endDate: `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    };
  }, [year, month]);

  // API 연동
  const { works, isLoading, refetch } = useWorkRecords(startDate, endDate);

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

  // 정정/추가 요청 후 데이터 갱신
  const handleCorrectionSubmitAndRefetch = async (data: Parameters<typeof handleCorrectionSubmit>[0]) => {
    await handleCorrectionSubmit(data);
    refetch();
  };
  const handleAddWorkSubmitAndRefetch = async (data: Parameters<typeof handleAddWorkSubmit>[0]) => {
    await handleAddWorkSubmit(data);
    refetch();
  };

  // 선택된 날짜의 근무 데이터만 필터링
  const selectedWorks = selectedDate
    ? works.filter(
        (w) =>
          w.workDate ===
          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
      )
    : [];

  // 날짜별 근무 개수/정정요청(빨간 점) 여부 workDots 생성
  const workDots: {
    [dateKey: string]: {
      count: number;
      hasCorrectionRequest: boolean;
    };
  } = {};
  works.forEach((work: WorkItem) => {
    const date = work.workDate;
    if (!workDots[date]) {
      workDots[date] = { count: 0, hasCorrectionRequest: false };
    }
    workDots[date].count++;
    if (work.isModified) {
      workDots[date].hasCorrectionRequest = true;
    }
  });

  // 월간 요약 계산 (근무 총 시간/급여)
  const monthLabel = `${month + 1}월`;
  const totalMinutes = works.reduce((sum, w) => sum + w.totalWorkMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const estimatedPay = works.reduce((sum, w) => sum + (w.totalSalary ?? 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={openDrawer} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MonthlyCalendarNav
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <View style={styles.dashedLine} />
        {/* 월간 캘린더 */}
        <MonthlyCalendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          workDots={workDots}
        />
        {/* 로딩 / 선택 날짜 근무리스트 */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            {selectedDate && (
              <SelectedDateWorkList
                works={selectedWorks}
                onPressAdd={openAddModal}
                onPressCorrectionRequest={openCorrectionModal}
              />
            )}
          </>
        )}
        {/* 월간 요약/급여 */}
        <MonthlySalarySummary
          monthLabel={monthLabel}
          totalHours={totalHours}
          estimatedPay={estimatedPay}
        />
        <WorkplaceSalarySummary
          workplaces={workplaceSalaryList}
          onPressDetail={() => {}}
        />
      </ScrollView>
      {/* 마이페이지 드로어 */}
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
      {/* 근무 추가 요청 모달 */}
      <AddWorkRequestModal
        visible={addModalVisible}
        onClose={closeAddModal}
        onSubmit={handleAddWorkSubmitAndRefetch}
      />
      {/* 근무 정정 요청 모달 */}
      <WorkerCorrectionRequestModal
        visible={correctionModalVisible}
        onClose={closeCorrectionModal}
        work={selectedWork}
        onSubmit={handleCorrectionSubmitAndRefetch}
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

export default WorkerMonthlyCalendarScreen;
