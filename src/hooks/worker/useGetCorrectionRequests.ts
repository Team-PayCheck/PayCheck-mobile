/**
 * 보낸 근무 요청(정정요청) 목록 조회, 상세 조회, 삭제를 관리하는 훅.
 * - 상태 필터(전체/대기/승인/반려)에 따른 목록 조회
 * - 카드 토글 시 상세 정보 lazy loading
 * - PENDING 상태 요청 취소(삭제) 기능
 */
import { useState, useEffect, useCallback } from "react";
import {
  getCorrectionRequests,
  getCorrectionRequestDetail,
  deleteCorrectionRequest,
} from "../../api/worker";
import { showSuccess, showError } from "../../utils/alert";
import type {
  CorrectionRequestResponse,
  CorrectionRequestData,
  CorrectionStatus,
} from "../../api/worker/types";

interface UseGetCorrectionRequestsReturn {
  // 목록
  requests: CorrectionRequestResponse[];
  isLoading: boolean;
  refetch: () => Promise<void>;

  // 필터
  statusFilter: CorrectionStatus | null;
  setStatusFilter: (status: CorrectionStatus | null) => void;

  // 상세 (토글)
  expandedId: number | null;
  detail: CorrectionRequestData | null;
  isDetailLoading: boolean;
  toggleExpand: (id: number) => void;

  // 삭제
  isDeleting: boolean;
  handleDelete: (id: number) => Promise<void>;
}

export function useGetCorrectionRequests(): UseGetCorrectionRequestsReturn {
  const [requests, setRequests] = useState<CorrectionRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CorrectionStatus | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<CorrectionRequestData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  // 목록 조회
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCorrectionRequests(statusFilter ?? undefined);
      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.warn("정정요청 목록 조회 실패:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 상세 토글
  const toggleExpand = useCallback(async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetail(null);
      return;
    }

    setExpandedId(id);
    setDetail(null);
    setIsDetailLoading(true);
    try {
      const response = await getCorrectionRequestDetail(id);
      if (response.success && response.data) {
        setDetail(response.data);
      }
    } catch (error) {
      console.warn("정정요청 상세 조회 실패:", error);
    } finally {
      setIsDetailLoading(false);
    }
  }, [expandedId]);

  // 삭제 (PENDING만)
  const handleDelete = useCallback(async (id: number) => {
    setIsDeleting(true);
    try {
      const response = await deleteCorrectionRequest(id);
      if (response.success) {
        showSuccess("요청이 취소되었습니다.");
        setExpandedId(null);
        setDetail(null);
        await fetchRequests();
      } else {
        showError("취소 실패", "요청 취소에 실패했습니다.");
      }
    } catch (error) {
      console.warn("정정요청 취소 실패:", error);
      showError("요청 취소에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    refetch: fetchRequests,
    statusFilter,
    setStatusFilter,
    expandedId,
    detail,
    isDetailLoading,
    toggleExpand,
    isDeleting,
    handleDelete,
  };
}
