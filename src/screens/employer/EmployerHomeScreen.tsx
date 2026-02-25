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
import WorkerManageHeader from "../../components/employer/worker-manage/WorkerManageHeader";
import NoticeBoard from "../../components/common/NoticeBoard";
import WeeklyDateBar from "../../components/common/WeeklyDateBar";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import { colors } from "../../constants/colors";
import EmployerTimeline from "../../components/employer/home/EmployerTimeline";
import EmployerWorkerListSection from "../../components/employer/home/EmployerWorkerListSection";
import EmployerAddWorkModal from "../../components/employer/home/EmployerAddWorkModal";
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
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isAddWorkModalVisible, setIsAddWorkModalVisible] = useState(false);
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());

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

  const { workRecords, refetch } =
    useEmployerDailyWorkRecords(selectedWorkplaceId, dateStr);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      {isWorkplacesLoading || selectedWorkplace === null ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <WorkerManageHeader
            selectedWorkplace={selectedWorkplace}
            workplaces={workplaces}
            onWorkplaceChange={handleWorkplaceChange}
          />
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <NoticeBoard notices={dummyNotices} />

            <WeeklyDateBar
              weekTitle={weekTitle}
              weekDays={weekDays}
              selectedDate={selectedDate.getDate()}
              onPressCalendarIcon={handleOpenCalendar}
              onPressDay={handleDayPress}
            />

            {/* 타임라인 */}
            <EmployerTimeline workRecords={workRecords} />

            {/* 근무자 리스트 */}
            <EmployerWorkerListSection
              workRecords={workRecords}
              onPressAdd={() => setIsAddWorkModalVisible(true)}
            />
          </ScrollView>
        </>
      )}

      <EmployerNavigationBar activeTab="home" onTabPress={handleTabPress} />

      {/* 근무 추가 모달 */}
      {selectedWorkplace && (
        <EmployerAddWorkModal
          visible={isAddWorkModalVisible}
          onClose={() => setIsAddWorkModalVisible(false)}
          workplaceId={selectedWorkplace.id}
          workplaceName={selectedWorkplace.name}
          selectedDate={dateStr}
          onSuccess={refetch}
        />
      )}

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
          showListButton={false}
        />
        <View style={{ marginTop: 20 }}>
          <MonthlyCalendar
            year={calendarYear}
            month={calendarMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </View>
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
});

export default EmployerHomeScreen;
