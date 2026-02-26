/**
 * 받은 근무 요청(정정요청) 관리 훅.
 * - 사업장 목록 조회 + 선택
 * - 상태 필터(전체/대기/승인/거절)
 * - 정정요청 목록 조회 + 클라이언트 페이징
 * - 카드 토글 시 상세 정보 lazy loading
 * - 승인/거절 처리
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import {
	getWorkplaces,
	getCorrectionRequests,
	getCorrectionRequestDetail,
	approveCorrectionRequest,
	rejectCorrectionRequest,
} from "../../api/employer";
import { showSuccess, showError } from "../../utils/alert";
import type {
	WorkplaceListItem,
	CorrectionRequestListItem,
	CorrectionRequestDetail,
	CorrectionRequestStatus,
} from "../../api/employer/types";

const PAGE_SIZE = 10;

interface UseReceivedRequestsReturn {
	// 사업장
	workplaces: WorkplaceListItem[];
	isWorkplacesLoading: boolean;
	selectedWorkplaceId: number | null;
	setSelectedWorkplaceId: (id: number | null) => void;

	// 필터
	statusFilter: CorrectionRequestStatus | null;
	setStatusFilter: (status: CorrectionRequestStatus | null) => void;

	// 목록 (페이징)
	requests: CorrectionRequestListItem[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	setCurrentPage: (page: number) => void;

	// 상세 (토글)
	expandedId: number | null;
	detail: CorrectionRequestDetail | null;
	isDetailLoading: boolean;
	toggleExpand: (id: number) => void;

	// 승인/거절
	isProcessing: boolean;
	handleApprove: (id: number) => void;
	handleReject: (id: number) => void;
}

export function useReceivedRequests(): UseReceivedRequestsReturn {
	// === 사업장 ===
	const [workplaces, setWorkplaces] = useState<WorkplaceListItem[]>([]);
	const [isWorkplacesLoading, setIsWorkplacesLoading] = useState(true);
	const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number | null>(null);

	// === 필터 ===
	const [statusFilter, setStatusFilterRaw] = useState<CorrectionRequestStatus | null>(null);

	// === 목록 ===
	const [allRequests, setAllRequests] = useState<CorrectionRequestListItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPageRaw] = useState(0);

	// === 상세 ===
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [detail, setDetail] = useState<CorrectionRequestDetail | null>(null);
	const [isDetailLoading, setIsDetailLoading] = useState(false);

	// === 승인/거절 ===
	const [isProcessing, setIsProcessing] = useState(false);

	// 클라이언트 페이징 계산
	const totalPages = useMemo(() => Math.ceil(allRequests.length / PAGE_SIZE), [allRequests]);
	const requests = useMemo(() => {
		const start = currentPage * PAGE_SIZE;
		return allRequests.slice(start, start + PAGE_SIZE);
	}, [allRequests, currentPage]);

	// 사업장 목록 조회
	useEffect(() => {
		const fetchWorkplaces = async () => {
			try {
				const response = await getWorkplaces();
				const data = Array.isArray(response.data) ? response.data : [];
				setWorkplaces(data);
				if (data.length > 0 && !selectedWorkplaceId) {
					setSelectedWorkplaceId(data[0].id);
				}
			} catch {
				setWorkplaces([]);
			} finally {
				setIsWorkplacesLoading(false);
			}
		};
		fetchWorkplaces();
	}, []);

	// 정정요청 목록 조회
	const fetchRequests = useCallback(async () => {
		if (!selectedWorkplaceId) return;

		setIsLoading(true);
		try {
			const response = await getCorrectionRequests(selectedWorkplaceId, {
				status: statusFilter ?? undefined,
			});
			if (response.success && response.data) {
				const data = Array.isArray(response.data) ? response.data : [];
				setAllRequests(data);
			} else {
				setAllRequests([]);
			}
		} catch {
			console.warn("정정요청 목록 조회 실패");
			setAllRequests([]);
		} finally {
			setIsLoading(false);
		}
	}, [selectedWorkplaceId, statusFilter]);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	// 필터/사업장 변경 시 페이지 리셋
	const setStatusFilter = useCallback((status: CorrectionRequestStatus | null) => {
		setStatusFilterRaw(status);
		setCurrentPageRaw(0);
		setExpandedId(null);
		setDetail(null);
	}, []);

	const handleSelectWorkplace = useCallback((id: number | null) => {
		setSelectedWorkplaceId(id);
		setCurrentPageRaw(0);
		setStatusFilterRaw(null);
		setExpandedId(null);
		setDetail(null);
	}, []);

	const setCurrentPage = useCallback((page: number) => {
		setCurrentPageRaw(page);
		setExpandedId(null);
		setDetail(null);
	}, []);

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
		} catch {
			console.warn("정정요청 상세 조회 실패");
		} finally {
			setIsDetailLoading(false);
		}
	}, [expandedId]);

	// 승인
	const handleApprove = useCallback((id: number) => {
		Alert.alert("승인", "이 요청을 승인하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "승인",
				onPress: async () => {
					setIsProcessing(true);
					try {
						const response = await approveCorrectionRequest(id);
						if (response.success) {
							showSuccess("요청이 승인되었습니다.");
							setExpandedId(null);
							setDetail(null);
							await fetchRequests();
						} else {
							showError(response.error?.message ?? "승인에 실패했습니다.");
						}
					} catch {
						showError("승인 처리에 실패했습니다.");
					} finally {
						setIsProcessing(false);
					}
				},
			},
		]);
	}, [fetchRequests]);

	// 거절
	const handleReject = useCallback((id: number) => {
		Alert.alert("거절", "이 요청을 거절하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "거절",
				style: "destructive",
				onPress: async () => {
					setIsProcessing(true);
					try {
						const response = await rejectCorrectionRequest(id);
						if (response.success) {
							showSuccess("요청이 거절되었습니다.");
							setExpandedId(null);
							setDetail(null);
							await fetchRequests();
						} else {
							showError(response.error?.message ?? "거절에 실패했습니다.");
						}
					} catch {
						showError("거절 처리에 실패했습니다.");
					} finally {
						setIsProcessing(false);
					}
				},
			},
		]);
	}, [fetchRequests]);

	return {
		workplaces,
		isWorkplacesLoading,
		selectedWorkplaceId,
		setSelectedWorkplaceId: handleSelectWorkplace,

		statusFilter,
		setStatusFilter,

		requests,
		isLoading,
		currentPage,
		totalPages,
		setCurrentPage,

		expandedId,
		detail,
		isDetailLoading,
		toggleExpand,

		isProcessing,
		handleApprove,
		handleReject,
	};
}
