import { useState, useEffect } from "react";
import type {
  EmployerWorkerContract,
  WorkScheduleRow,
  WorkDay,
  Contract,
  ContractWorker,
  WorkScheduleItem,
  PayrollDeductionType,
} from "../../api/employer/types";
import { getContractsByWorkplace, getContract } from "../../api/employer";

// ============ 변환 유틸 ============

// 문자열 형식: "MONDAY" ~ "SUNDAY"
const DAY_OF_WEEK_TO_KOREAN: Record<string, WorkDay> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

const DAY_OF_WEEK_TO_SUMMARY: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

// 숫자 형식: 1=월요일 ~ 7=일요일
const DAY_NUMBER_TO_KOREAN: Record<number, WorkDay> = {
  1: "월요일", 2: "화요일", 3: "수요일", 4: "목요일",
  5: "금요일", 6: "토요일", 7: "일요일",
};

const DAY_NUMBER_TO_SUMMARY: Record<number, string> = {
  1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토", 7: "일",
};

const resolveKoreanDay = (dayOfWeek: string | number): WorkDay => {
  if (typeof dayOfWeek === "number") {
    return DAY_NUMBER_TO_KOREAN[dayOfWeek] ?? "선택";
  }
  return DAY_OF_WEEK_TO_KOREAN[dayOfWeek.toUpperCase()] ?? "선택";
};

const resolveSummaryDay = (dayOfWeek: string | number): string => {
  if (typeof dayOfWeek === "number") {
    return DAY_NUMBER_TO_SUMMARY[dayOfWeek] ?? "";
  }
  return DAY_OF_WEEK_TO_SUMMARY[dayOfWeek.toUpperCase()] ?? "";
};

/** payrollDeductionType → fourMajorInsurance / incomeTax 변환 */
const mapDeductionType = (type: PayrollDeductionType) => {
  switch (type) {
    case "PART_TIME_TAX_AND_INSURANCE":
      return { fourMajorInsurance: true, incomeTax: true };
    case "PART_TIME_TAX_ONLY":
    case "FREELANCER":
      return { fourMajorInsurance: false, incomeTax: true };
    case "PART_TIME_NONE":
    default:
      return { fourMajorInsurance: false, incomeTax: false };
  }
};

/** Contract (API) → EmployerWorkerContract (UI) */
const mapContractToUI = (contract: Contract): EmployerWorkerContract => {
  let scheduleItems: WorkScheduleItem[] = [];
  try {
    scheduleItems = JSON.parse(contract.workSchedules) as WorkScheduleItem[];
  } catch {
    scheduleItems = [];
  }

  const workSchedules: WorkScheduleRow[] = scheduleItems.map((s, idx) => {
    const [startH = "00", startM = "00"] = s.startTime.split(":");
    const [endH = "00", endM = "00"] = s.endTime.split(":");
    return {
      key: `${contract.id}-${idx}`,
      day: resolveKoreanDay(s.dayOfWeek),
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
    };
  });

  const workDaysSummary = scheduleItems
    .map((s) => resolveSummaryDay(s.dayOfWeek))
    .filter(Boolean);

  const { fourMajorInsurance, incomeTax } = mapDeductionType(contract.payrollDeductionType);

  return {
    contractId: contract.id,
    workerId: contract.workerId,
    workerName: contract.workerName,
    workDaysSummary,
    hourlyWage: contract.hourlyWage,
    paymentDay: contract.paymentDay,
    fourMajorInsurance,
    incomeTax,
    workSchedules,
    contractStartDate: contract.contractStartDate,
    isActive: contract.isActive,
  };
};

// ============ 훅 ============

const useWorkplaceContracts = (workplaceId: number | null) => {
  const [workers, setWorkers] = useState<EmployerWorkerContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!workplaceId) {
      setWorkers([]);
      return;
    }

    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        // 1단계: 근무지 근무자 목록 조회
        const listResponse = await getContractsByWorkplace(workplaceId);
        const contractList = (listResponse.data || []) as ContractWorker[];

        // 2단계: 각 계약 상세 병렬 조회
        const detailResponses = await Promise.all(
          contractList.map((c) => getContract(c.id))
        );

        const contracts = detailResponses
          .map((res) => res.data as Contract)
          .filter(Boolean)
          .map(mapContractToUI);

        setWorkers(contracts);
      } catch {
        setWorkers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, [workplaceId]);

  const removeWorker = (contractId: number) => {
    setWorkers((prev) => prev.filter((w) => w.contractId !== contractId));
  };

  return { workers, isLoading, removeWorker };
};

export default useWorkplaceContracts;
