import type { WorkItem } from "../types/worker.types";

export interface WorkSummary {
	totalHours: number;
	estimatedPay: number;
}

/**
 * 근무 목록에서 요약(총 근무시간, 예상 근무비) 계산.
 * - 총 근무시간: COMPLETED 근무의 totalWorkMinutes 합산
 * - 예상 근무비: COMPLETED는 totalSalary, SCHEDULED는 hourlyWage × 시간으로 추정 (DELETED 제외)
 *   세금/보험은 고려하지 않는 단순 추정치.
 */
export const calculateWorkSummary = (works: WorkItem[]): WorkSummary => {
	let completedMinutes = 0;
	let estimatedPay = 0;

	for (const work of works) {
		if (work.status === "COMPLETED") {
			completedMinutes += work.totalWorkMinutes;
			estimatedPay += work.totalSalary ?? 0;
		} else if (work.status === "SCHEDULED") {
			const hourlyWage = work.hourlyWage ?? 0;
			estimatedPay += Math.round((hourlyWage * work.totalWorkMinutes) / 60);
		}
	}

	const totalHours = Math.round((completedMinutes / 60) * 10) / 10;

	return { totalHours, estimatedPay };
};
