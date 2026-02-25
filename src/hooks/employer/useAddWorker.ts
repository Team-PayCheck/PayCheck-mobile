import { useState, useCallback } from "react";
import { Alert } from "react-native";
import type {
  SearchedWorker,
  WorkScheduleRow,
  WorkSchedule,
  PayrollDeductionType,
} from "../../api/employer/types";
import { getWorkerByCode, createContract } from "../../api/employer";

let rowKeyCounter = 0;
const newRowKey = () => `add-${++rowKeyCounter}`;

const DEFAULT_ROW = (): WorkScheduleRow => ({
  key: newRowKey(),
  day: "선택",
  startHour: "10",
  startMinute: "00",
  endHour: "16",
  endMinute: "00",
  breakMinutes: 0,
});

const KOREAN_TO_DAY_NUMBER: Record<string, number> = {
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
  일요일: 7,
};

const mapDeductionType = (
  fourMajorInsurance: boolean,
  incomeTax: boolean
): PayrollDeductionType => {
  if (fourMajorInsurance && incomeTax) return "PART_TIME_TAX_AND_INSURANCE";  // && 추가
  if (incomeTax) return "PART_TIME_TAX_ONLY";
  return "PART_TIME_NONE";
};

const useAddWorker = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [workerCode, setWorkerCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedWorker, setSearchedWorker] = useState<SearchedWorker | null>(null);
  const [hourlyWage, setHourlyWage] = useState("10,030");
  const [paymentDay, setPaymentDay] = useState("10");
  const [fourMajorInsurance, setFourMajorInsurance] = useState(false);
  const [incomeTax, setIncomeTax] = useState(false);
  const [scheduleRows, setScheduleRows] = useState<WorkScheduleRow[]>([DEFAULT_ROW()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = useCallback(async () => {
    if (isSearching) return;
    if (!workerCode.trim()) {
      Alert.alert("입력 오류", "근무자 코드를 입력해주세요.");
      return;
    }
    setIsSearching(true);
    try {
      const response = await getWorkerByCode(workerCode.trim());
      const workerData = response.data as SearchedWorker | null;
      if (workerData && workerData.id) {
        setSearchedWorker(workerData);
      } else {
        Alert.alert("검색 실패", "해당 근무자 코드를 찾을 수 없습니다.");
        setSearchedWorker(null);
      }
    } catch {
      Alert.alert("검색 실패", "해당 근무자 코드를 찾을 수 없습니다.");
      setSearchedWorker(null);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, workerCode]);

  const goToStep2 = () => setStep(2);
  const goToStep1 = () => setStep(1);

  const handleAddRow = () => {
    setScheduleRows((prev) => [...prev, DEFAULT_ROW()]);
  };

  const handleDeleteRow = (key: string) => {
    setScheduleRows((prev) => prev.filter((r) => r.key !== key));
  };

  const handleRowChange = (key: string, updated: WorkScheduleRow) => {
    setScheduleRows((prev) => prev.map((r) => (r.key === key ? updated : r)));
  };

  const handleSubmit = async (workplaceId: number): Promise<number> => {
    if (!searchedWorker?.workerCode) {
      throw new Error("근무자 코드가 없습니다.");
    }

    const wage = parseInt(hourlyWage.replace(/,/g, ""), 10);
    if (isNaN(wage) || wage <= 0) {
      throw new Error("올바른 시급을 입력해주세요.");
    }

    const day = parseInt(paymentDay, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      throw new Error("급여지급일은 1~31 사이로 입력해주세요.");
    }

    const validSchedules = scheduleRows.filter((r) => r.day !== "선택");
    if (validSchedules.length === 0) {
      throw new Error("최소 1개 이상의 근무 스케줄을 등록해야 합니다.");
    }

    const workSchedules: WorkSchedule[] = validSchedules.map((row) => ({
      dayOfWeek: KOREAN_TO_DAY_NUMBER[row.day] ?? 1,
      startTime: `${row.startHour}:${row.startMinute}`,
      endTime: `${row.endHour}:${row.endMinute}`,
      breakMinutes: row.breakMinutes,
    }));

    const today = new Date();
    const contractStartDate =
      new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0] ?? "";

    setIsSubmitting(true);
    try {
      const response = await createContract(workplaceId, {
        workerCode: searchedWorker.workerCode,
        hourlyWage: wage,
        workSchedules,
        contractStartDate,
        contractEndDate: null,
        paymentDay: day,
        payrollDeductionType: mapDeductionType(fourMajorInsurance, incomeTax),
      });
      const created = response.data as { id: number };
      return created.id;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setWorkerCode("");
    setIsSearching(false);
    setSearchedWorker(null);
    setHourlyWage("10,030");
    setPaymentDay("10");
    setFourMajorInsurance(false);
    setIncomeTax(false);
    setScheduleRows([DEFAULT_ROW()]);
    setIsSubmitting(false);
  };

  return {
    step,
    workerCode,
    setWorkerCode,
    isSearching,
    searchedWorker,
    hourlyWage,
    setHourlyWage,
    paymentDay,
    setPaymentDay,
    fourMajorInsurance,
    setFourMajorInsurance,
    incomeTax,
    setIncomeTax,
    scheduleRows,
    isSubmitting,
    handleSearch,
    goToStep2,
    goToStep1,
    handleAddRow,
    handleDeleteRow,
    handleRowChange,
    handleSubmit,
    reset,
  };
};

export default useAddWorker;
