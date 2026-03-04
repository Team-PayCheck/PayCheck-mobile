/**
 * 공지사항 CRUD 상태 관리 훅.
 * - 사업장별 공지 목록 조회
 * - 공지 상세 조회 (lazy loading)
 * - 생성/수정/삭제
 */
import { useState, useEffect, useCallback } from "react";
import {
	getNotices,
	getNotice,
	createNotice,
	updateNotice,
	deleteNotice,
} from "../../api/notice";
import { showSuccess, showError } from "../../utils/alert";
import type { NoticeCardItem } from "../../types/common/notice.types";
import type {
	NoticeDetailResponse,
	CreateNoticeRequest,
	UpdateNoticeRequest,
} from "../../api/notice/types";

interface UseNoticesReturn {
	// 목록
	notices: NoticeCardItem[];
	isLoading: boolean;
	refetch: () => Promise<void>;

	// 상세
	selectedNotice: NoticeDetailResponse | null;
	isDetailLoading: boolean;
	fetchDetail: (noticeId: number) => Promise<void>;
	clearDetail: () => void;

	// CRUD
	handleCreate: (reqData: CreateNoticeRequest) => Promise<boolean>;
	handleUpdate: (noticeId: number, reqData: UpdateNoticeRequest) => Promise<boolean>;
	handleDelete: (noticeId: number) => Promise<boolean>;
}

export function useNotices(workplaceId: number | null): UseNoticesReturn {
	const [notices, setNotices] = useState<NoticeCardItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const [selectedNotice, setSelectedNotice] = useState<NoticeDetailResponse | null>(null);
	const [isDetailLoading, setIsDetailLoading] = useState(false);

	// 목록 조회
	const fetchNotices = useCallback(async () => {
		if (!workplaceId) {
			setNotices([]);
			return;
		}

		setIsLoading(true);
		try {
			const response = await getNotices(workplaceId);
			if (response.success && response.data) {
				setNotices(response.data);
			} else {
				setNotices([]);
			}
		} catch {
			setNotices([]);
		} finally {
			setIsLoading(false);
		}
	}, [workplaceId]);

	useEffect(() => {
		fetchNotices();
	}, [fetchNotices]);

	// 상세 조회
	const fetchDetail = useCallback(async (noticeId: number) => {
		setIsDetailLoading(true);
		try {
			const response = await getNotice(noticeId);
			if (response.success && response.data) {
				setSelectedNotice(response.data);
			}
		} catch {
			showError("공지사항 조회에 실패했습니다.");
		} finally {
			setIsDetailLoading(false);
		}
	}, []);

	const clearDetail = useCallback(() => {
		setSelectedNotice(null);
	}, []);

	// 생성
	const handleCreate = useCallback(
		async (reqData: CreateNoticeRequest) => {
			if (!workplaceId) return false;
			try {
				const response = await createNotice(workplaceId, reqData);
				if (response.success) {
					showSuccess("공지사항이 등록되었습니다.");
					await fetchNotices();
					return true;
				}
			} catch (error) {
				showError(
					error instanceof Error ? error.message : "공지사항 등록에 실패했습니다."
				);
			}
			return false;
		},
		[workplaceId, fetchNotices]
	);

	// 수정
	const handleUpdate = useCallback(
		async (noticeId: number, reqData: UpdateNoticeRequest) => {
			try {
				const response = await updateNotice(noticeId, reqData);
				if (response.success) {
					showSuccess("공지사항이 수정되었습니다.");
					await fetchNotices();
					return true;
				}
			} catch (error) {
				showError(
					error instanceof Error ? error.message : "공지사항 수정에 실패했습니다."
				);
			}
			return false;
		},
		[fetchNotices]
	);

	// 삭제
	const handleDelete = useCallback(
		async (noticeId: number) => {
			try {
				const response = await deleteNotice(noticeId);
				if (response.success) {
					showSuccess("공지사항이 삭제되었습니다.");
					setSelectedNotice(null);
					await fetchNotices();
					return true;
				}
			} catch (error) {
				showError(
					error instanceof Error ? error.message : "공지사항 삭제에 실패했습니다."
				);
			}
			return false;
		},
		[fetchNotices]
	);

	return {
		notices,
		isLoading,
		refetch: fetchNotices,

		selectedNotice,
		isDetailLoading,
		fetchDetail,
		clearDetail,

		handleCreate,
		handleUpdate,
		handleDelete,
	};
}
