import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../constants/colors";
import { Text } from "../../components/common/Text";
import Header from "../../components/layout/Header";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import EmployerMyPageDrawer from "../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import AccountTermsContent from "../../components/mypage/AccountTermsContent";
import MonthlyCalendarNav from "../../components/common/MonthlyCalendarNav";
import MonthlyCalendar from "../../components/common/MonthlyCalendar";
import WorkerManageHeader from "../../components/employer/worker-manage/WorkerManageHeader";
import WorkerFilterTabs, { type WorkerFilterId } from "../../components/employer/worker-manage/WorkerFilterTabs";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import { useEmployerDrawer } from "../../hooks/employer/useEmployerDrawer";
import useWorkplaceContracts from "../../hooks/employer/useWorkplaceContracts";
import { getWorkplaces, getWorkRecords } from "../../api/employer";
import type { WorkplaceDetails, WorkRecord } from "../../api/employer/types";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const EmployerRemittanceManageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();
  const { openDrawer, drawerProps, accountSheetProps } = useEmployerDrawer(navigation);

  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // 근무지 목록
  const [workplaces, setWorkplaces] = useState<WorkplaceDetails[]>([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkplaceDetails | null>(null);
  const [isWorkplacesLoading, setIsWorkplacesLoading] = useState(false);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      setIsWorkplacesLoading(true);
      try {
        const res = await getWorkplaces();
        const data = Array.isArray(res.data) ? res.data : [];
        setWorkplaces(data);
        if (data.length > 0) setSelectedWorkplace(data[0]);
      } catch {
        setWorkplaces([]);
      } finally {
        setIsWorkplacesLoading(false);
      }
    };
    fetchWorkplaces();
  }, []);

  // 근무자 목록 (선택된 근무지 기준)
  const { workers, isLoading: isWorkersLoading } = useWorkplaceContracts(selectedWorkplace?.id ?? null);
  const [selectedContractId, setSelectedContractId] = useState<WorkerFilterId>("all");

  // 근무지가 바뀌거나 근무자 목록이 처음 로딩되면 첫 번째 근무자 자동선택
  useEffect(() => {
    if (workers.length > 0) {
      setSelectedContractId(workers[0].contractId);
    } else {
      setSelectedContractId("all");
    }
  }, [workers]);

  // 선택된 근무자 객체
  const selectedWorker = useMemo(
    () => workers.find((w) => w.contractId === selectedContractId) ?? null,
    [workers, selectedContractId]
  );

  // 근무 기록 + workDots
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedWorkplace?.id || selectedContractId === "all") {
      setWorkRecords([]);
      return;
    }
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const fetchRecords = async () => {
      try {
        const res = await getWorkRecords(selectedWorkplace.id, startDate, endDate);
        const all: WorkRecord[] = Array.isArray(res.data) ? res.data : [];
        // 선택된 근무자의 기록만 필터링
        setWorkRecords(all.filter((r) => r.contractId === selectedContractId));
      } catch {
        setWorkRecords([]);
      }
    };
    fetchRecords();
  }, [selectedWorkplace?.id, selectedContractId, year, month]);

  const workDots = useMemo(() => {
    const dots: Record<string, { count: number; hasCorrectionRequest: boolean }> = {};
    workRecords.forEach((r) => {
      const key = r.workDate;
      if (!dots[key]) dots[key] = { count: 0, hasCorrectionRequest: false };
      dots[key].count += 1;
      if (r.status === "PENDING_APPROVAL") dots[key].hasCorrectionRequest = true;
    });
    return dots;
  }, [workRecords]);

  const handlePrevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else { setMonth((m) => m - 1); }
  };
  const handleNextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else { setMonth((m) => m + 1); }
  };

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onPressLeft={openDrawer} />
      {isWorkplacesLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <>
          {selectedWorkplace && (
            <WorkerManageHeader
              selectedWorkplace={selectedWorkplace}
              workplaces={workplaces}
              onWorkplaceChange={setSelectedWorkplace}
            />
          )}
          {isWorkersLoading ? (
            <ActivityIndicator style={styles.workerLoader} color={colors.primary} size="small" />
          ) : (
            <WorkerFilterTabs
              workers={workers}
              selectedId={selectedContractId}
              onSelect={setSelectedContractId}
            />
          )}
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            <MonthlyCalendarNav
              year={year}
              month={month}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              showListButton={false}
            />
            {selectedWorker && (
              <View style={styles.workerCard}>
                <View style={styles.workerAvatar}>
                  <Text weight="Bold" style={styles.workerAvatarText}>
                    {selectedWorker.workerName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.workerInfo}>
                  <Text weight="Bold" style={styles.workerName}>
                    {selectedWorker.workerName}
                  </Text>
                  <Text weight="Regular" style={styles.workerDays}>
                    {selectedWorker.workDaysSummary.join(" / ")}
                  </Text>
                </View>
              </View>
            )}
            <MonthlyCalendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              workDots={workDots}
            />
          </ScrollView>
        </>
      )}
      <EmployerNavigationBar activeTab="transfer" onTabPress={handleTabPress} />

      <EmployerMyPageDrawer {...drawerProps} />
      <BottomSheetModal {...accountSheetProps}>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  loader: {
    flex: 1,
  },
  workerLoader: {
    paddingVertical: 12,
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  workerAvatarText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  workerInfo: {
    flex: 1,
    gap: 2,
  },
  workerName: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  workerDays: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default EmployerRemittanceManageScreen;
