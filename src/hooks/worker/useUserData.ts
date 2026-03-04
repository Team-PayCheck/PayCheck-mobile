import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "../../api/user";
import type { UserResponse, WorkerResponse } from "../../api/user/types";

interface UseUserDataReturn {
  user: UserResponse | null;
  worker: WorkerResponse | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * 사용자 프로필 및 근로자 정보 관리 훅
 * - /api/users/me 응답에서 사용자 + 근로자 정보를 함께 추출
 */

export function useWorkerData(): UseUserDataReturn {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [worker, setWorker] = useState<WorkerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const userRes = await getUserProfile();

      if (!userRes.success || !userRes.data) {
        setUser(null);
        setWorker(null);
        return;
      }

      setUser(userRes.data);

      // /api/users/me 응답에 workerCode가 있으면 근로자 정보 추출
      if (userRes.data.workerCode) {
        setWorker({
          id: userRes.data.id,
          userId: userRes.data.id,
          name: userRes.data.name,
          phone: userRes.data.phone,
          workerCode: userRes.data.workerCode,
          accountNumber: userRes.data.accountNumber || '',
          bankName: userRes.data.bankName || '',
        });
      } else {
        setWorker(null);
      }
    } catch (error) {
      console.error('사용자 프로필 조회 실패:', error);
      setUser(null);
      setWorker(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { user, worker, isLoading, refetch: fetchData };
}
