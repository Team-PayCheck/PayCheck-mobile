import { useState, useEffect, useCallback } from "react";
import type { WorkRecord } from "../../api/employer/types";
import { getWorkRecords } from "../../api/employer";

const useEmployerDailyWorkRecords = (
  workplaceId: number | null,
  date: string
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

  const removeRecord = useCallback((id: number) => {
    setWorkRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { workRecords, isLoading, refetch: fetchWorkRecords, removeRecord };
};

export default useEmployerDailyWorkRecords;
