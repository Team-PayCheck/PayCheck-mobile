import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import SelectedDateWorkList from "../../components/worker/monthlyCalendar/SelectedDateWorkList";
import { workerMonthlyWorkList } from "../../dummyData/workerMonthlyCalendar";
import { colors } from "../../constants/colors";

const WorkerMonthlyCalendarScreen: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const closeDrawer = () => setIsDrawerVisible(false);
  const openDrawer = () => setIsDrawerVisible(true);

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
        {/* 이후 급여 영역 추가 */}
      </ScrollView>
      <MyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        // ...기타 Drawer 핸들러는 이후 추가
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
