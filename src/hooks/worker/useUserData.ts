import { useState, useEffect, useCallback } from "react";
import { getUserProfile } from "../../api/user";
import { getWorkerInfo } from "../../api/worker";
import type { UserResponse, WorkerResponse } from "../../api/user/types";

interface UseUserDataReturn {
  user: UserResponse | null;
  worker: WorkerResponse | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

/**
 * 사용자 프로필 및 근로자 정보 관리 훅
 * - 사용자 프로필 조회 (getUserProfile)
 * - 근로자 정보 조회 (getWorkerInfo)
 * - 프로필 업데이트 (updateUserProfile, updateAccountInfo)
 */

export function useWorkerData(): UseUserDataReturn {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [worker, setWorker] = useState<WorkerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // 1. 사용자 프로필 조회
      const userRes = await getUserProfile();

      if (!userRes.success || !userRes.data) {
        setUser(null);
        setWorker(null);
        return;
      }

      setUser(userRes.data);

      // 2. 근로자 정보 조회
      try {
        const workerResponse = await getWorkerInfo(userRes.data.id);
        const hasValidWorkerData = workerResponse.success && workerResponse.data;

        if (hasValidWorkerData && workerResponse.data) {
          setWorker(workerResponse.data);
        } else {
          setWorker(null);
        }
      } catch (workerError) {
        console.error('근로자 정보 조회 실패:', workerError);
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
