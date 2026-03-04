import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../constants/colors";
import { Text } from "../../components/common/Text";
import { formatCurrency } from "../../utils/format";
import Header from "../../components/layout/Header";
import EmployerNavigationBar, { type EmployerTabName } from "../../components/layout/EmployerNavigationBar";
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
import {
  getWorkplaces,
  getWorkRecords,
  getSalariesByYearMonth,
  getPaymentsByYearMonth,
  calculateSalary,
  createPayment,
  completePayment,
} from "../../api/employer";
import type { WorkplaceDetails, WorkRecord, SalaryPaymentItem } from "../../api/employer/types";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const EmployerRemittanceManageScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();
  const { openDrawer, drawerProps, accountSheetProps } = useEmployerDrawer(navigation);

  // 송금관리는 지난달 급여를 기본으로 보여줌 (예: 3월 10일(월급날) 접속 → 2월 급여 표시)
  const [year, setYear] = useState(() => {
    const d = new Date();
    return d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear();
  });
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return d.getMonth() === 0 ? 11 : d.getMonth() - 1;
  });

  const [workplaces, setWorkplaces] = useState<WorkplaceDetails[]>([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkplaceDetails | null>(null);
  const [isWorkplacesLoading, setIsWorkplacesLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
  }, []);

  const { workers, isLoading: isWorkersLoading } = useWorkplaceContracts(selectedWorkplace?.id ?? null);
  const [selectedContractId, setSelectedContractId] = useState<WorkerFilterId>("all");

  useEffect(() => {
    setSelectedContractId(workers.length > 0 ? workers[0].contractId : "all");
  }, [workers]);

  const selectedWorker = useMemo(
    () => workers.find((w) => w.contractId === selectedContractId) ?? null,
    [workers, selectedContractId]
  );

  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);

  useEffect(() => {
    if (!selectedWorkplace?.id || selectedContractId === "all") {
      setWorkRecords([]);
      return;
    }
    const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const fetch = async () => {
      try {
        const res = await getWorkRecords(selectedWorkplace.id, startDate, endDate);
        const all: WorkRecord[] = Array.isArray(res.data) ? res.data : [];
        setWorkRecords(all.filter((r) => r.contractId === selectedContractId));
      } catch {
        setWorkRecords([]);
      }
    };
    fetch();
  }, [selectedWorkplace?.id, selectedContractId, year, month]);

  const workDots = useMemo(() => {
    const dots: Record<string, { count: number; hasCorrectionRequest: boolean }> = {};
    workRecords.forEach((r) => {
      if (!dots[r.workDate]) dots[r.workDate] = { count: 0, hasCorrectionRequest: false };
      dots[r.workDate].count += 1;
      if (r.status === "PENDING_APPROVAL") dots[r.workDate].hasCorrectionRequest = true;
    });
    return dots;
  }, [workRecords]);

  const [salaryPaymentItem, setSalaryPaymentItem] = useState<SalaryPaymentItem | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  useEffect(() => {
    if (!selectedWorkplace?.id || !selectedWorker) {
      setSalaryPaymentItem(null);
      setPendingPaymentId(null);
      setIsPaymentCompleted(false);
      return;
    }
    const fetch = async () => {
      try {
        const [salaryRes, paymentRes] = await Promise.all([
          getSalariesByYearMonth(selectedWorkplace.id, year, month + 1),
          getPaymentsByYearMonth(selectedWorkplace.id, year, month + 1),
        ]);

        const salaryItems = Array.isArray(salaryRes.data) ? salaryRes.data : [];
        setSalaryPaymentItem(
          salaryItems.find((item) => item.workerName === selectedWorker.workerName) ?? null
        );

        const paymentItems = Array.isArray(paymentRes.data) ? paymentRes.data : [];
        const matchedPayment = paymentItems.find((p) => p.workerName === selectedWorker.workerName) ?? null;
        if (matchedPayment?.isPaid) {
          setIsPaymentCompleted(true);
          setPendingPaymentId(null);
        } else {
          setIsPaymentCompleted(false);
          setPendingPaymentId(matchedPayment?.id ?? null);
        }
      } catch {
        setSalaryPaymentItem(null);
        setIsPaymentCompleted(false);
        setPendingPaymentId(null);
      }
    };
    fetch();
  }, [selectedWorkplace?.id, selectedWorker?.workerName, year, month]);

  const [isSalarySheetVisible, setIsSalarySheetVisible] = useState(false);

  const handlePrevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const handleTabPress = (tab: EmployerTabName) => navigation.replace(TAB_SCREEN_MAP[tab]);

  const handleRemittance = () => {
    if (!salaryPaymentItem) {
      Alert.alert(`${month + 1}월 급여 데이터가 없습니다.`);
      return;
    }
    Alert.alert(
      "송금 확인",
      `${selectedWorker?.workerName}님에게\n${formatCurrency(salaryAmount)}원을 송금하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "송금하기",
          onPress: async () => {
            try {
              let salaryId = salaryPaymentItem.id;
              if (salaryPaymentItem.totalGrossPay === 0) {
                const calcRes = await calculateSalary(salaryPaymentItem.contractId, year, month + 1);
                if (!calcRes.data) throw new Error("급여 계산에 실패했습니다.");
                salaryId = calcRes.data.id;
              }
              const res = await createPayment({ salaryId });
              if (!res.data) throw new Error("송금 데이터를 받지 못했습니다.");
              setPendingPaymentId(res.data.id);
              await Linking.openURL(res.data.tossLink);
            } catch (e: any) {
              Alert.alert("송금 실패", e.message ?? "다시 시도해주세요.");
            }
          },
        },
      ]
    );
  };

  const handleCompletePayment = async () => {
    if (!pendingPaymentId) return;
    try {
      await completePayment(pendingPaymentId);
      setPendingPaymentId(null);
      setIsPaymentCompleted(true);
    } catch (e: any) {
      Alert.alert("완료 처리 실패", e.message ?? "다시 시도해주세요.");
    }
  };

  const salaryAmount = salaryPaymentItem?.netPay ?? 0;

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
              showAll={false}
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
              <Text weight="Medium" style={styles.salaryLabel}>{month + 1}월 순 급여</Text>
              <Text weight="Bold" style={styles.salaryValue}>
                {formatCurrency(salaryAmount)}원
              </Text>
            </View>
            {/* TODO: 고용주 전용 급여명세서 API 필요 — 현재 SalaryStatementSheet는 근로자 API 기반 */}
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => setIsSalarySheetVisible(true)}
              activeOpacity={0.7}
            >
              <Text weight="SemiBold" style={styles.outlineButtonText}>
                급여명세서 확인하기
              </Text>
            </TouchableOpacity>
            {/*
              버튼 상태:
              1. "송금하기"      → handleRemittance (토스 딥링크 오픈)
              2. "송금 완료 처리" → handleCompletePayment (서버 완료 통보)
              3. "n월 송금 완료" 배지 
            */}
            {isPaymentCompleted ? (
              <View style={styles.paidBadge}>
                <Text weight="SemiBold" style={styles.paidText}>{month + 1}월 송금 완료</Text>
              </View>
            ) : pendingPaymentId !== null ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleCompletePayment} activeOpacity={0.8}>
                <Text weight="Bold" style={styles.primaryButtonText}>송금 완료 처리</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryButton} onPress={handleRemittance} activeOpacity={0.8}>
                <Text weight="Bold" style={styles.primaryButtonText}>송금하기</Text>
              </TouchableOpacity>
            )}
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
    paddingBottom: 20,
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
  paidBadge: {
    marginTop: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  paidText: {
    fontSize: 15,
    color: colors.primary,
  },
});

export default EmployerRemittanceManageScreen;
