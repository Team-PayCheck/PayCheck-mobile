// ============ 공통 Enum ============

export type NoticeCategory = "HANDOVER" | "URGENT" | "SCHEDULE" | "ETC";

// ============ API Request 타입 ============

export interface CreateNoticeRequest {
	category: NoticeCategory;
	title: string;
	content: string;
	expiresAt: string; // ISO 8601 (e.g. "2026-03-10T18:00:00")
}

export interface UpdateNoticeRequest {
	category?: NoticeCategory;
	title?: string;
	content?: string;
	expiresAt: string; // 필수
}

// ============ API Response 타입 ============

/** GET /api/workplaces/{workplaceId}/notices - 목록 조회 아이템 */
export interface NoticeListResponse {
	id: number;
	category: NoticeCategory;
	title: string;
	authorName: string;
	createdAt: string; // ISO 8601
}

/** GET /api/notices/{noticeId} - 단건 상세 조회 */
export interface NoticeDetailResponse {
	id: number;
	workplaceId: number;
	workplaceName: string;
	authorId: number;
	authorName: string;
	category: NoticeCategory;
	title: string;
	content: string;
	expiresAt: string; // ISO 8601
	createdAt: string;
	updatedAt: string;
}
