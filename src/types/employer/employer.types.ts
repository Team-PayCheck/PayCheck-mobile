// ============ UI 전용 타입 ============

/** 요일 */
export type WorkDay =
  | "일요일"
  | "월요일"
  | "화요일"
  | "수요일"
  | "목요일"
  | "금요일"
  | "토요일"
  | "선택";

/** 근무시간 행 1개 */
export interface WorkScheduleRow {
  key: string;
  day: WorkDay;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  breakMinutes: number;
}

/** 근무자 카드에 표시되는 계약+프로필 정보 */
export interface EmployerWorkerContract {
  contractId: number;
  workerId: number;
  workerCode: string;
  workerName: string;
  workerProfileImage?: string;
  workDaysSummary: string[];
  hourlyWage: number;
  paymentDay: number;
  fourMajorInsurance: boolean;
  incomeTax: boolean;
  workSchedules: WorkScheduleRow[];
  contractStartDate: string;
  isActive: boolean;
}

/** 계약 정보 수정 요청 파라미터 (UI → Hook) */
export interface ContractUpdateRequest {
  hourlyWage: number;
  paymentDay: number;
  fourMajorInsurance: boolean;
  incomeTax: boolean;
  workSchedules: WorkScheduleRow[];
}
