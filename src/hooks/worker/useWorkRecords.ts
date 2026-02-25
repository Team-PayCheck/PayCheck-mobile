/**
 * 기간별 근무 기록 조회 훅.
 * 주간캘린더, 월간캘린더 등에서 startDate/endDate를 전달하여 재사용.
 */
import { useState, useEffect, useCallback } from "react";
import { getWorkRecords } from "../../api/worker";
import type { WorkItem } from "../../types/worker.types";

const useWorkRecords = (startDate: string, endDate: string) => {
	const [works, setWorks] = useState<WorkItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchWorks = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await getWorkRecords(startDate, endDate);
			const works = (response.data ?? []).map((work: WorkItem) => {
				if (work.totalWorkMinutes >= 0) return work;
				// 백엔드에서 익일 근무가 음수로 반환된 경우 보정
				const [startH, startM] = work.startTime.split(":").map(Number);
				const [endH, endM] = work.endTime.split(":").map(Number);
				const totalWorkMinutes =
					(endH * 60 + endM - (startH * 60 + startM) + 24 * 60) - (work.breakMinutes ?? 0);
				return { ...work, totalWorkMinutes };
			});
			setWorks(works);
		} catch {
			setWorks([]);
		} finally {
			setIsLoading(false);
		}
	}, [startDate, endDate]);

	useEffect(() => {
		fetchWorks();
	}, [fetchWorks]);

	return { works, isLoading, refetch: fetchWorks };
};

export default useWorkRecords;
