import { useState, useEffect, useCallback } from "react";
import type { WorkRecord } from "../../api/employer/types";
import { getWorkRecords } from "../../api/employer";

const getPrevDateStr = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const timeToMinutes = (time: string): number => {
  const [h = "0", m = "0"] = time.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};

// 자정을 넘는 근무: 종료 시각이 시작 시각보다 같거나 작음
const isOvernight = (record: WorkRecord): boolean =>
  timeToMinutes(record.endTime) <= timeToMinutes(record.startTime);

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
      const prevDate = getPrevDateStr(date);
      const response = await getWorkRecords(workplaceId, prevDate, date);
      const all = (response.data ?? []) as WorkRecord[];
      // 선택일에 보여줘야 할 근무만 필터링:
      // - 선택일 시작 근무는 전부
      // - 전날 시작 근무는 자정을 넘기는 경우만 (익일 0시~endTime 구간을 표시)
      const filtered = all.filter((r) => {
        if (r.workDate === date) return true;
        if (r.workDate === prevDate) return isOvernight(r);
        return false;
      });
      setWorkRecords(filtered);
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
