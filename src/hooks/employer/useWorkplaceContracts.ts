import { useState, useEffect } from "react";
import type {
  EmployerWorkerContract,
  WorkScheduleRow,
  Contract,
  ContractWorker,
  WorkScheduleItem,
  WorkSchedule,
  ContractUpdateRequest,
} from "../../api/employer/types";
import { getContractsByWorkplace, getContract, updateContract, deleteContract } from "../../api/employer";
import {
  resolveKoreanDay,
  resolveSummaryDay,
  toDayOrder,
  KOREAN_TO_DAY_NUMBER,
  mapDeductionTypeFromUI,
  mapDeductionType,
} from "../../utils/employerSchedule";

/** Contract (API) → EmployerWorkerContract (UI) */
const mapContractToUI = (contract: Contract): EmployerWorkerContract => {
  let scheduleItems: WorkScheduleItem[] = [];
  try {
    scheduleItems = JSON.parse(contract.workSchedules) as WorkScheduleItem[];
  } catch {
    scheduleItems = [];
  }

  const sortedItems = [...scheduleItems].sort(
    (a, b) => toDayOrder(a.dayOfWeek) - toDayOrder(b.dayOfWeek)
  );

  const workSchedules: WorkScheduleRow[] = sortedItems.map((s, idx) => {
    const [startH = "00", startM = "00"] = s.startTime.split(":");
    const [endH = "00", endM = "00"] = s.endTime.split(":");
    return {
      key: `${contract.id}-${idx}`,
      day: resolveKoreanDay(s.dayOfWeek),
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
      breakMinutes: s.breakMinutes ?? 0,
    };
  });

  const workDaysSummary = sortedItems
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

  const resignWorker = async (contractId: number): Promise<void> => {
    await deleteContract(contractId);
    setWorkers((prev) => prev.filter((w) => w.contractId !== contractId));
  };

  const addWorker = async (contractId: number): Promise<void> => {
    const res = await getContract(contractId);
    const contract = res.data as Contract;
    if (contract) {
      setWorkers((prev) => [...prev, mapContractToUI(contract)]);
    }
  };

  const updateWorker = async (
    contractId: number,
    data: ContractUpdateRequest
  ): Promise<void> => {
    const apiSchedules: WorkSchedule[] = data.workSchedules
      .filter((row) => row.day !== "선택")
      .map((row) => ({
        dayOfWeek: KOREAN_TO_DAY_NUMBER[row.day] ?? 1,
        startTime: `${row.startHour}:${row.startMinute}`,
        endTime: `${row.endHour}:${row.endMinute}`,
        breakMinutes: row.breakMinutes,
      }));

    await updateContract(contractId, {
      hourlyWage: data.hourlyWage,
      paymentDay: data.paymentDay,
      workSchedules: apiSchedules,
      payrollDeductionType: mapDeductionTypeFromUI(
        data.fourMajorInsurance,
        data.incomeTax
      ),
    });

    const sortedSchedules = [...data.workSchedules]
      .filter((row) => row.day !== "선택")
      .sort((a, b) => (KOREAN_TO_DAY_NUMBER[a.day] ?? 99) - (KOREAN_TO_DAY_NUMBER[b.day] ?? 99));

    const newWorkDaysSummary = sortedSchedules.map((row) => row.day.charAt(0));

    setWorkers((prev) =>
      prev.map((w) =>
        w.contractId === contractId
          ? {
              ...w,
              hourlyWage: data.hourlyWage,
              paymentDay: data.paymentDay,
              fourMajorInsurance: data.fourMajorInsurance,
              incomeTax: data.incomeTax,
              workSchedules: sortedSchedules,
              workDaysSummary: newWorkDaysSummary,
            }
          : w
      )
    );
  };

  return { workers, isLoading, resignWorker, updateWorker, addWorker };
};

export default useWorkplaceContracts;
