// ============ 알림 타입 Enum ============

export type NotificationType =
	| "SCHEDULE_CREATED"
	| "SCHEDULE_CHANGE"
	| "SCHEDULE_DELETED"
	| "UNREAD_CORRECTION_REQUEST"
	| "CORRECTION_RESPONSE"
	| "INVITATION"
	| "RESIGNATION"
	| "PAYMENT_SUCCESS"
	| "WORK_RECORD_CONFIRMATION"
	| "NOTICE_CREATED";

export type ActionType =
	| "VIEW_WORK_RECORD"
	| "VIEW_CORRECTION_REQUEST"
	| "VIEW_PENDING_APPROVAL"
	| "VIEW_SALARY"
	| "VIEW_PAYMENT_MANAGEMENT"
	| "VIEW_WORKPLACE_INVITATION"
	| "VIEW_NOTICE"
	| "NONE";

// ============ API Request 타입 ============

export interface NotificationListParams {
	is_read?: boolean;
	page?: number;
	size?: number;
}

export interface RegisterFcmTokenRequest {
	token: string;
	deviceInfo?: string;
}

export interface DeleteFcmTokenRequest {
	token: string;
}

// ============ API Response 타입 ============

/** 알림 페이징 응답 래퍼 */
export interface NotificationPagedResponse {
	notifications: NotificationResponse[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	unreadCount: number;
}

/** GET /api/notifications - 알림 목록 아이템 */
export interface NotificationResponse {
	id: number;
	type: NotificationType;
	actionType: ActionType;
	actionData: string | null;
	title: string;
	message?: string;
	isRead: boolean;
	createdAt: string; // ISO 8601
	readAt: string | null;
}

/** GET /api/notifications/unread-count */
export interface UnreadCountResponse {
	count: number;
}
