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
			setWorks(response.data ?? []);
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
