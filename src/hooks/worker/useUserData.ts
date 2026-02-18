import { useState, useEffect } from "react";
import { getUserProfile } from "../../api/userApi";
import { getWorkerInfo } from "../../api/workerApi";
import type { UserResponse, WorkerResponse } from "../../api/userApiResponse.type";

interface UseUserDataReturn {
  user: UserResponse | null;
  worker: WorkerResponse | null;
  isLoading: boolean;
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

  useEffect(() => {
    // 근로자 정보 조회
    const fetchWorkerInfo = async (userId: number) => {
      try {
        const workerResponse = await getWorkerInfo(userId);
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
    };
    
    // 사용자 데이터 조회
    const fetchData = async () => {
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
        await fetchWorkerInfo(userRes.data.id);
      } catch (error) {
        console.error('사용자 프로필 조회 실패:', error);
        setUser(null);
        setWorker(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { user, worker, isLoading };
}
