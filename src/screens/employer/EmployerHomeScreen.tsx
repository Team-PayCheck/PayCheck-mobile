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
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
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
import EmployerTimeline from "../../components/employer/home/EmployerTimeline";
import EmployerWorkerListSection from "../../components/employer/home/EmployerWorkerListSection";
import EmployerAddWorkModal from "../../components/employer/home/EmployerAddWorkModal";
import EmployerMyPageDrawer from "../../components/employer/mypage/EmployerMyPageDrawer";
import AccountTermsContent from "../../components/mypage/AccountTermsContent";
import { useWorkplaceManagement } from "../../hooks/employer/useWorkplaceManagement";
import useEmployerDailyWorkRecords from "../../hooks/employer/useEmployerDailyWorkRecords";
import { useLogoutHandler } from "../../hooks/common/useLogoutHandler";
import type { WorkplaceDetails } from "../../api/employer/types";
import type { WeekDay } from "../../types/worker.types";
import { getWeekDays, getWeekRange, formatDateStr } from "../../utils/date";
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

  // Drawer 상태
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof EmployerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  const today = useMemo(() => new Date(), []);
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

  const dateStr = useMemo(() => formatDateStr(selectedDate), [selectedDate]);

  const { workRecords, isLoading: isWorkRecordsLoading, refetch, removeRecord } =
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
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      {isWorkplacesLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : selectedWorkplace === null ? (
        <View style={styles.loader}>
          <Text style={styles.emptyWorkplaceText}>등록된 근무지가 없습니다</Text>
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
            {/* TODO: 공지 게시판 API 연동 후 dummyNotices 교체 */}
            <NoticeBoard notices={dummyNotices} />

            <WeeklyDateBar
              weekTitle={weekTitle}
              weekDays={weekDays}
              selectedDate={selectedDate.getDate()}
              onPressCalendarIcon={handleOpenCalendar}
              onPressDay={handleDayPress}
            />

            {/* 타임라인 + 근무자 리스트 */}
            {isWorkRecordsLoading ? (
              <View style={styles.recordsLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <>
                <EmployerTimeline workRecords={workRecords} />
                <EmployerWorkerListSection
                  workRecords={workRecords}
                  onPressAdd={() => setIsAddWorkModalVisible(true)}
                  onDeleteItem={removeRecord}
                  onRefetch={refetch}
                />
              </>
            )}
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

      {/* 마이페이지 Drawer */}
      <EmployerMyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => navigateFromDrawer("EmployerProfileEdit")}
        onPressWorkplaceManage={() => navigateFromDrawer("EmployerWorkplaceManage")}
        onPressReceivedRequests={() => navigateFromDrawer("EmployerReceivedRequests")}
        onPressAccountSettings={() => {
          setIsDrawerVisible(false);
          setTimeout(() => setIsAccountSheetVisible(true), 220);
        }}
        onPressLogout={handleLogout}
        onPressWithdraw={() => navigateFromDrawer("EmployerWithdraw")}
      />

      {/* 계정 이용/이용동의 바텀시트 */}
      <BottomSheetModal
        visible={isAccountSheetVisible}
        onClose={() => setIsAccountSheetVisible(false)}
      >
        <AccountTermsContent />
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
  emptyWorkplaceText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  recordsLoader: {
    paddingVertical: 48,
    alignItems: "center",
  },
});

export default EmployerHomeScreen;
