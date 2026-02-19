import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
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

  // 선택된 날짜의 더미 근무 데이터만 필터링
  const selectedWorks = workerMonthlyWorkList.filter(
    (w) =>
      w.workDate ===
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
  );

  // 월간 요약 계산 (더미데이터 전체 기준)
  const monthLabel = `${month + 1}월`;
  const totalMinutes = workerMonthlyWorkList.reduce((sum, w) => sum + w.totalWorkMinutes, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const estimatedPay = workerMonthlyWorkList.reduce((sum, w) => sum + (w.totalSalary ?? 0), 0);

  // 근무지별 급여 더미 데이터 (실제 로직은 추후 API 연동)
  const workplaces = workplaceSalaryList;

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
          onPressWeeklyView={() => {}}
        />
        <View style={styles.dashedLine} />
        <MonthlyCalendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <SelectedDateWorkList
          works={selectedWorks}
          onPressAdd={() => {}}
          onPressCorrectionRequest={() => {}}
        />
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
