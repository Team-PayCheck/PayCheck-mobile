import type { WorkDay, WorkScheduleRow } from "../types/employer/employer.types";
import type { PayrollDeductionType } from "../api/employer/types";

// ── 요일 변환 맵 ──────────────────────────────────────────────

// 영문 문자열 형식
export const DAY_OF_WEEK_TO_KOREAN: Record<string, WorkDay> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

export const DAY_OF_WEEK_TO_SUMMARY: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

// 숫자 형식: 1=월요일 ~ 7=일요일
export const DAY_NUMBER_TO_KOREAN: Record<number, WorkDay> = {
  1: "월요일", 2: "화요일", 3: "수요일", 4: "목요일",
  5: "금요일", 6: "토요일", 7: "일요일",
};

export const DAY_NUMBER_TO_SUMMARY: Record<number, string> = {
  1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토", 7: "일",
};

/** WorkDay (한국어) → dayOfWeek 숫자 변환 */
export const KOREAN_TO_DAY_NUMBER: Record<string, number> = {
  월요일: 1, 화요일: 2, 수요일: 3, 목요일: 4,
  금요일: 5, 토요일: 6, 일요일: 7,
};

/** 영문 요일 문자열 → 정렬 순서 */
export const DAY_OF_WEEK_STRING_TO_NUMBER: Record<string, number> = {
  MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4,
  FRIDAY: 5, SATURDAY: 6, SUNDAY: 7,
};

// ── 요일 변환 함수 ─────────────────────────────────────────────

/** string | number 요일 → 한국어 WorkDay 변환 */
export const resolveKoreanDay = (dayOfWeek: string | number): WorkDay => {
  if (typeof dayOfWeek === "number") {
    return DAY_NUMBER_TO_KOREAN[dayOfWeek] ?? "선택";
  }
  return DAY_OF_WEEK_TO_KOREAN[dayOfWeek.toUpperCase()] ?? "선택";
};

/** string | number 요일 → 요약 한글 (월/화/수...) 변환 */
export const resolveSummaryDay = (dayOfWeek: string | number): string => {
  if (typeof dayOfWeek === "number") {
    return DAY_NUMBER_TO_SUMMARY[dayOfWeek] ?? "";
  }
  return DAY_OF_WEEK_TO_SUMMARY[dayOfWeek.toUpperCase()] ?? "";
};

/** string | number 요일 → 정렬 순서 (1=월 ~ 7=일) */
export const toDayOrder = (dayOfWeek: string | number): number => {
  if (typeof dayOfWeek === "number") return dayOfWeek;
  return DAY_OF_WEEK_STRING_TO_NUMBER[dayOfWeek.toUpperCase()] ?? 99;
};

// ── 공제 유형 변환 함수 ────────────────────────────────────────

/** fourMajorInsurance / incomeTax → payrollDeductionType 변환 */
export const mapDeductionTypeFromUI = (
  fourMajorInsurance: boolean,
  incomeTax: boolean
): PayrollDeductionType => {
  if (fourMajorInsurance && incomeTax) return "PART_TIME_TAX_AND_INSURANCE";
  if (incomeTax) return "PART_TIME_TAX_ONLY";
  return "PART_TIME_NONE";
};

/** payrollDeductionType → fourMajorInsurance / incomeTax 변환 */
export const mapDeductionType = (type: PayrollDeductionType) => {
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

// ── 스케줄 차트 공통 상수/함수 ────────────────────────────────

/** 요일 헤더 표시용 (일~토, 0-인덱스) */
export const SCHEDULE_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 한국어 요일 → 차트 컬럼 인덱스 (0=일 ~ 6=토) */
export const SCHEDULE_DAY_INDEX: Record<string, number> = {
  일요일: 0, 월요일: 1, 화요일: 2, 수요일: 3,
  목요일: 4, 금요일: 5, 토요일: 6,
};

/** 시간 레이블 영역 너비 */
export const SCHEDULE_TIME_LABEL_WIDTH = 52;

export interface ScheduleBar {
  top: number;
  height: number;
  key: string;
}

/**
 * 특정 요일의 스케줄 바 위치/높이 계산
 * @param rows 근무 스케줄 행 목록
 * @param dayIndex 0=일 ~ 6=토
 * @param hourHeight 시간당 픽셀 높이
 * @param rangeStartMin 표시 범위 시작(분), 기본 0
 * @param rangeEndMin 표시 범위 끝(분), 기본 24*60
 */
export const getScheduleBarsForDay = (
  rows: WorkScheduleRow[],
  dayIndex: number,
  hourHeight: number,
  rangeStartMin = 0,
  rangeEndMin = 24 * 60
): ScheduleBar[] => {
  return rows
    .filter((row) => SCHEDULE_DAY_INDEX[row.day] === dayIndex)
    .flatMap((row) => {
      const startMin =
        parseInt(row.startHour, 10) * 60 + parseInt(row.startMinute, 10);
      let endMin =
        parseInt(row.endHour, 10) * 60 + parseInt(row.endMinute, 10);
      if (endMin <= startMin) endMin += 24 * 60;
      const clippedStart = Math.max(startMin, rangeStartMin);
      const clippedEnd = Math.min(endMin, rangeEndMin);
      if (clippedStart >= clippedEnd) return [];
      const top = ((clippedStart - rangeStartMin) / 60) * hourHeight;
      const height = ((clippedEnd - clippedStart) / 60) * hourHeight;
      return [{ top, height, key: row.key }];
    });
};
