import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import type { WorkItem } from "../../types/worker.types";
import SelectedDateWorkList from "../../components/worker/monthlyCalendar/SelectedDateWorkList";
import { workerMonthlyWorkList, workplaceSalaryList } from "../../dummyData/workerMonthlyCalendar";
import { colors } from "../../constants/colors";
import MonthlySalarySummary from "../../components/worker/monthlyCalendar/MonthlySalarySummary";
import WorkplaceSalarySummary from "../../components/worker/monthlyCalendar/WorkplaceSalarySummary";
import { WorkerStackParamList } from "../../navigation/WorkerStack";

const WorkerMonthlyCalendarScreen: React.FC = ({ navigation }: any) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const closeDrawer = () => setIsDrawerVisible(false);
  const openDrawer = () => setIsDrawerVisible(true);

  // Drawer 내비게이션 핸들러
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const { useLogoutHandler } = require("../../hooks/common/useLogoutHandler");
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return prevMonth;
    });
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return nextMonth;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 선택된 날짜의 근무 데이터만 필터링
  const selectedWorks = workerMonthlyWorkList.filter(
    (w) =>
      w.workDate ===
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  );

  // 날짜별 근무 개수/정정요청(빨간 점) 여부 workDots 생성
  const workDots: {
    [dateKey: string]: {
      count: number;
      hasCorrectionRequest: boolean;
    };
  } = {};
  workerMonthlyWorkList.forEach((work: WorkItem) => {
    const date = work.workDate;
    if (!workDots[date]) {
      workDots[date] = { count: 0, hasCorrectionRequest: false };
    }
    workDots[date].count++;
    // isModified가 true면 해당 날짜 빨간 점
    if (work.isModified) {
      workDots[date].hasCorrectionRequest = true;
    }
  });

  // 월간 요약 계산 (근무 총 시간/급여)
  const monthLabel = `${month + 1}월`;
  const totalMinutes = workerMonthlyWorkList.reduce((sum, w) => sum + w.totalWorkMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const estimatedPay = workerMonthlyWorkList.reduce((sum, w) => sum + (w.totalSalary ?? 0), 0);

  // 근무지별 급여 더미 데이터 (실제 로직은 추후 API 연동)
  const workplaces = workplaceSalaryList;

  // 주요 화면 렌더링: 캘린더, 근무리스트, 요약, 드로어
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
        {/* 선택 날짜 근무리스트 */}
        <SelectedDateWorkList
          works={selectedWorks}
          onPressAdd={() => {}}
          onPressCorrectionRequest={() => {}}
        />
        {/* 월간 요약/급여 */}
        <MonthlySalarySummary
          monthLabel={monthLabel}
          totalHours={totalHours}
          estimatedPay={estimatedPay}
        />
        <WorkplaceSalarySummary
          workplaces={workplaces}
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

export default WorkerMonthlyCalendarScreen;
