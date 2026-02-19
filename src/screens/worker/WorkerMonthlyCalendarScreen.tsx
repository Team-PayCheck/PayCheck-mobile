import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/layout/Header";
import MyPageDrawer from "../../components/mypage/drawer/MyPageDrawer";
import { colors } from "../../constants/colors";
import MonthlyCalendarNav from "../../components/worker/monthlyCalendar/MonthlyCalendarNav";

const WorkerMonthlyCalendarScreen: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
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
        {/* 이후 달력, 근무, 급여 영역 추가 */}
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
