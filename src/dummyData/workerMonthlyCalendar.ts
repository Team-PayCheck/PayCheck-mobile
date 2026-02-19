import type { WorkItem } from "../types/worker.types";

// 근무지별 급여 더미 데이터
export const workplaceSalaryList = [
  {
    workplaceName: "버거킹",
    baseSalary: 200000,
    deduction: 50000,
    maxSalary: 250000,
    status: "송금 대기중",
  },
  {
    workplaceName: "교내근로",
    baseSalary: 200000,
    deduction: 50000,
    maxSalary: 250000,
    status: "송금 대기중",
  },
  {
    workplaceName: "맥도날드",
    baseSalary: 200000,
    deduction: 50000,
    maxSalary: 250000,
    status: "송금 대기중",
  },
];

// 월별 근무 리스트 더미 데이터
export const workerMonthlyWorkList: WorkItem[] = [
  {
    id: 1,
    contractId: 101,
    workerName: "홍길동",
    workerCode: "W001",
    workplaceName: "버거킹",
    workDate: "2026-02-20",
    startTime: "09:00",
    endTime: "13:00",
    breakMinutes: 30,
    totalWorkMinutes: 210,
    status: "SCHEDULED",
    isModified: false,
    memo: null,
    baseSalary: 40000,
    nightSalary: 0,
    holidaySalary: 0,
    totalSalary: 40000,
    salary: 10000,
  },
  {
    id: 2,
    contractId: 102,
    workerName: "홍길동",
    workerCode: "W001",
    workplaceName: "교내근로",
    workDate: "2026-02-20",
    startTime: "14:00",
    endTime: "18:00",
    breakMinutes: 20,
    totalWorkMinutes: 220,
    status: "COMPLETED",
    isModified: false,
    memo: null,
    baseSalary: 44000,
    nightSalary: 0,
    holidaySalary: 0,
    totalSalary: 44000,
    salary: 11000,
  },
  {
    id: 3,
    contractId: 103,
    workerName: "홍길동",
    workerCode: "W001",
    workplaceName: "맥도날드",
    workDate: "2026-02-21",
    startTime: "19:00",
    endTime: "22:00",
    breakMinutes: 10,
    totalWorkMinutes: 170,
    status: "COMPLETED",
    isModified: false,
    memo: null,
    baseSalary: 31500,
    nightSalary: 0,
    holidaySalary: 0,
    totalSalary: 31500,
    salary: 10500,
  },
];

// Calendar(월간캘린더)에서 날짜별 점(dot) 표시용 데이터 변환 함수
// - count: 해당 날짜의 근무 개수(최대 3개까지 점으로 표시)
// - hasCorrectionRequest: 해당 날짜에 정정요청(수정됨)이 1개라도 있으면 true → 첫 점이 빨간색
//   (isModified가 true인 근무가 있으면 true)
//
// 반환 형태: { [date: string]: { count: number; hasCorrectionRequest: boolean } }
export function getWorkDotsFromWorkList(workList: WorkItem[]) {
  const dots: { [date: string]: { count: number; hasCorrectionRequest: boolean } } = {};
  for (const work of workList) {
    const date = work.workDate;
    // 날짜별 객체가 없으면 초기화
    if (!dots[date]) {
      dots[date] = { count: 0, hasCorrectionRequest: false };
    }
    // 근무 1건 추가
    dots[date].count++;
    // 정정요청(수정됨)이 있으면 해당 날짜에 표시
    if (work.isModified) {
      dots[date].hasCorrectionRequest = true;
    }
  }
  return dots;
}
