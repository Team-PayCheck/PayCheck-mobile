import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../constants/colors";
import { BANK_NAME_TO_CODE } from "../../constants/bank";
import { Text } from "../../components/common/Text";
import { formatCurrency } from "../../utils/format";
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
import SalaryStatementSheet from "../../components/worker/salary/SalaryStatementSheet";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import { useEmployerDrawer } from "../../hooks/employer/useEmployerDrawer";
import useWorkplaceContracts from "../../hooks/employer/useWorkplaceContracts";
import { getWorkplaces, getWorkRecords } from "../../api/employer";
import type { WorkplaceDetails, WorkRecord } from "../../api/employer/types";
import { getWorkerByCode } from "../../api/worker";

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

  // 예상 노무비 계산
  const estimatedPay = useMemo(() => {
    return workRecords.reduce((total, record) => {
      const [startH = 0, startM = 0] = record.startTime.split(":").map(Number);
      const [endH = 0, endM = 0] = record.endTime.split(":").map(Number);
      const totalMinutes =
        ((endH * 60 + endM - (startH * 60 + startM) + 24 * 60) % (24 * 60)) -
        (record.breakMinutes ?? 0);
      return total + (Math.max(0, totalMinutes) / 60) * record.hourlyWage;
    }, 0);
  }, [workRecords]);

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

  // 선택된 근무자의 계좌 정보 (토스 송금 연동)
  const [workerBankInfo, setWorkerBankInfo] = useState<{ bankName?: string; accountNumber?: string } | null>(null);

  useEffect(() => {
    if (!selectedWorker) {
      setWorkerBankInfo(null);
      return;
    }
    const fetchBankInfo = async () => {
      try {
        const res = await getWorkerByCode(selectedWorker.workerCode);
        setWorkerBankInfo({ bankName: res.data?.bankName, accountNumber: res.data?.accountNumber });
      } catch {
        setWorkerBankInfo(null);
      }
    };
    fetchBankInfo();
  }, [selectedWorker?.workerCode]);

  const [isSalarySheetVisible, setIsSalarySheetVisible] = useState(false);

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

  const handleRemittance = async () => {
    const amount = Math.round(estimatedPay);
    let url = `supertoss://send?amount=${amount}`;
    if (workerBankInfo?.bankName && workerBankInfo?.accountNumber) {
      const bankCode = BANK_NAME_TO_CODE[workerBankInfo.bankName];
      if (bankCode) {
        url += `&bankCode=${bankCode}&accountNo=${workerBankInfo.accountNumber}`;
      }
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("토스 앱이 설치되어 있지 않습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onPressLeft={openDrawer} />
      {isWorkplacesLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <>
          <View style={styles.calendarNavWrapper}>
            <MonthlyCalendarNav
              year={year}
              month={month}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              showListButton={false}
            />
          </View>
          <View style={styles.dashedDivider} />
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
              selectedDate={null}
              onDateSelect={() => {}}
              workDots={workDots}
            />
            <View style={styles.salaryRow}>
              <Text weight="Medium" style={styles.salaryLabel}>이번 달 예상 노무비</Text>
              <Text weight="Bold" style={styles.salaryValue}>
                {formatCurrency(Math.round(estimatedPay))}원
              </Text>
            </View>
            {/* TODO: 고용주 전용 급여명세서 API 필요 (GET /api/employer/contracts/{contractId}/salary)
                현재 SalaryStatementSheet는 근로자 API 기반이라 고용주 화면에서 데이터 없음 */}
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setIsSalarySheetVisible(true)}
              activeOpacity={0.7}
            >
              <Text weight="SemiBold" style={styles.outlineButtonText}>
                급여명세서 확인하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleRemittance}
              activeOpacity={0.8}
            >
              <Text weight="Bold" style={styles.primaryButtonText}>
                송금하기
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
      <EmployerNavigationBar activeTab="transfer" onTabPress={handleTabPress} />

      <SalaryStatementSheet
        visible={isSalarySheetVisible}
        onClose={() => setIsSalarySheetVisible(false)}
        year={year}
        month={month + 1}
      />
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
  },
  loader: {
    flex: 1,
  },
  workerLoader: {
    paddingVertical: 12,
  },
  calendarNavWrapper: {
    paddingHorizontal: 20,
  },
  dashedDivider: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  workerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
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
  salaryRow: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  salaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  salaryValue: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  outlineButton: {
    marginTop: 12,
    backgroundColor: colors.disabled,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  outlineButtonText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    color: colors.white,
  },
});

export default EmployerRemittanceManageScreen;
