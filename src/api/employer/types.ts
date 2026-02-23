// ============ 근무지 관련 타입 ============

/** 고용주가 관리하는 근무지 */
export interface Workplace {
  id: number;
  name: string;
  /** 현재 활성 근무자 수 */
  workerCount: number;
}

// ============ 근무 스케줄 타입 ============

/** 요일 (드롭다운 선택값) */
export type WorkDay =
  | "일요일"
  | "월요일"
  | "화요일"
  | "수요일"
  | "목요일"
  | "금요일"
  | "토요일"
  | "선택";

/** 근무시간 행 1개 (요일 + 시작/종료 시간) */
export interface WorkScheduleRow {
  /** 고유 식별용 key (UI 전용) */
  key: string;
  day: WorkDay;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

// ============ 근무자 계약 관련 타입 ============

/** 근무자 카드에 표시되는 계약+프로필 정보 */
export interface EmployerWorkerContract {
  contractId: number;
  workerId: number;
  workerName: string;
  /** 프로필 이미지 URL (없으면 undefined) */
  workerProfileImage?: string;
  /** 요약 표시용 근무 요일 (예: ["월", "수", "금"]) */
  workDaysSummary: string[];
  hourlyWage: number;
  /** 매달 N일 */
  paymentDay: number;
  fourMajorInsurance: boolean;
  incomeTax: boolean;
  workSchedules: WorkScheduleRow[];
  contractStartDate: string;
  isActive: boolean;
}

/** 계약 정보 수정 요청 파라미터 */
export interface ContractUpdateRequest {
  hourlyWage: number;
  paymentDay: number;
  fourMajorInsurance: boolean;
  incomeTax: boolean;
  workSchedules: WorkScheduleRow[];
}
