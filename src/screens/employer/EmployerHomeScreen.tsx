import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../components/layout/Header";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import WorkerManageHeader from "../../components/employer/worker-manage/WorkerManageHeader";
import NoticeBoard from "../../components/common/NoticeBoard";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
import { useWorkplaceManagement } from "../../hooks/employer/useWorkplaceManagement";
import useEmployerDailyWorkRecords from "../../hooks/employer/useEmployerDailyWorkRecords";
import type { WorkplaceDetails } from "../../api/employer/types";
import type { WeekDay } from "../../types/worker.types";
import { getWeekDays, getWeekRange } from "../../utils/date";
import { dummyNotices } from "../../dummyData/workerWeeklyCalendar";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const EmployerHomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-indexed
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const {
    workplaces,
    isLoading: isWorkplacesLoading,
    selectedWorkplaceId,
    setSelectedWorkplaceId,
  } = useWorkplaceManagement();

  const selectedWorkplace =
    workplaces.find((wp) => wp.id === selectedWorkplaceId) ?? null;

  const dateStr = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const { workRecords } =
    useEmployerDailyWorkRecords(selectedWorkplaceId, dateStr);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  // 주 날짜 전체(Date 객체) — onPressDay에서 전체 날짜 복원용
  const weekDates = useMemo(() => {
    const { startDate } = getWeekRange(selectedDate);
    const monday = new Date(startDate + "T00:00:00");
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const weekTitle = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 근무 캘린더`;

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  const handleWorkplaceChange = (workplace: WorkplaceDetails) => {
    setSelectedWorkplaceId(workplace.id);
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear((y) => y - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear((y) => y + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCalendarYear(date.getFullYear());
    setCalendarMonth(date.getMonth());
    setIsCalendarModalVisible(false);
  };

  const handleDayPress = (day: WeekDay) => {
    const found = weekDates.find((d) => d.getDate() === day.date);
    if (found) setSelectedDate(found);
  };

  const handleOpenCalendar = () => {
    setCalendarYear(selectedDate.getFullYear());
    setCalendarMonth(selectedDate.getMonth());
    setIsCalendarModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      {isWorkplacesLoading || selectedWorkplace === null ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MonthlyCalendarNav
            year={calendarYear}
            month={calendarMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            hideListView
          />

          <WorkerManageHeader
            selectedWorkplace={selectedWorkplace}
            workplaces={workplaces}
            onWorkplaceChange={handleWorkplaceChange}
          />

          <NoticeBoard notices={dummyNotices} />

          <WeeklyDateBar
            weekTitle={weekTitle}
            weekDays={weekDays}
            selectedDate={selectedDate.getDate()}
            onPressCalendarIcon={handleOpenCalendar}
            onPressDay={handleDayPress}
          />

          {/* 타임라인 (다음 단계) */}
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>타임라인 준비 중...</Text>
          </View>

          {/* 근무자 리스트 (다음 단계) */}
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              근무자 리스트 준비 중... ({workRecords.length}건)
            </Text>
          </View>
        </ScrollView>
      )}

      <EmployerNavigationBar activeTab="home" onTabPress={handleTabPress} />

      {/* 달력 팝업 */}
      <BottomSheetModal
        visible={isCalendarModalVisible}
        onClose={() => setIsCalendarModalVisible(false)}
        maxHeight="70%"
      >
        <MonthlyCalendarNav
          year={calendarYear}
          month={calendarMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          hideListView
        />
        <MonthlyCalendar
          year={calendarYear}
          month={calendarMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: 100,
    backgroundColor: colors.backgroundGrey,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default EmployerHomeScreen;
