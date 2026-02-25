import type { WorkDay, PayrollDeductionType } from "../api/employer/types";

// ── 요일 변환 맵 ──────────────────────────────────────────────

// 영문 문자열 형식: "MONDAY" ~ "SUNDAY"
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
