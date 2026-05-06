import type { WorkItem } from "../types/worker.types";

export interface WorkSummary {
	totalHours: number;
	estimatedPay: number;
}

/**
 * 근무 목록에서 요약(총 근무시간, 예상 근무비) 계산. DELETED 근무는 두 값 모두 제외.
 * - 총 근무시간: COMPLETED 근무의 totalWorkMinutes 합산
 * - 예상 근무비: COMPLETED + SCHEDULED의 totalSalary 합산
 *   (백엔드가 SCHEDULED도 totalSalary를 계산해 반환 — PayCheck-backend#177)
 */
export const calculateWorkSummary = (works: WorkItem[]): WorkSummary => {
	let completedMinutes = 0;
	let estimatedPay = 0;

	for (const work of works) {
		if (work.status === "DELETED") continue;

		if (work.status === "COMPLETED") {
			completedMinutes += work.totalWorkMinutes;
		}
		estimatedPay += work.totalSalary ?? 0;
	}

	const totalHours = Math.round((completedMinutes / 60) * 10) / 10;

	return { totalHours, estimatedPay };
};
