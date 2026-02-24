import { useState, useEffect, useCallback } from "react";
import type { WorkRecord } from "../../api/employer/types";
import { getWorkRecords } from "../../api/employer";

const useEmployerDailyWorkRecords = (
  workplaceId: number | null,
  date: string // "yyyy-MM-dd"
) => {
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkRecords = useCallback(async () => {
    if (!workplaceId || !date) {
      setWorkRecords([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getWorkRecords(workplaceId, date, date);
      setWorkRecords((response.data ?? []) as WorkRecord[]);
    } catch {
      setWorkRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [workplaceId, date]);

  useEffect(() => {
    fetchWorkRecords();
  }, [fetchWorkRecords]);

  return { workRecords, isLoading, refetch: fetchWorkRecords };
};

export default useEmployerDailyWorkRecords;
