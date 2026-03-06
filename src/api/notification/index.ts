import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type {
	NotificationResponse,
	NotificationListParams,
	PagedResponse,
	UnreadCountResponse,
	RegisterFcmTokenRequest,
	DeleteFcmTokenRequest,
} from "./types";

// ============ 인앱 알림 API ============

/**
 * 내 알림 목록 조회
 * GET /api/notifications
 */
export const getNotifications = async (
	params?: NotificationListParams
): Promise<ApiResponse<PagedResponse<NotificationResponse>>> => {
	try {
		const { data } = await api.get<
			ApiResponse<PagedResponse<NotificationResponse>>
		>("/api/notifications", { params });
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<
			ApiResponse<PagedResponse<NotificationResponse>>
		>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"알림 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 읽지 않은 알림 개수 조회
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = async (): Promise<
	ApiResponse<UnreadCountResponse>
> => {
	try {
		const { data } = await api.get<ApiResponse<UnreadCountResponse>>(
			"/api/notifications/unread-count"
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<UnreadCountResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"읽지 않은 알림 개수 조회 실패";
		throw new Error(message);
	}
};

/**
 * 알림 읽음 처리
 * PUT /api/notifications/{id}/read
 */
export const readNotification = async (
	notificationId: number
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.put<ApiResponse<null>>(
			`/api/notifications/${notificationId}/read`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"알림 읽음 처리 실패";
		throw new Error(message);
	}
};

/**
 * 모든 알림 읽음 처리
 * PUT /api/notifications/read-all
 */
export const readAllNotifications = async (): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.put<ApiResponse<null>>(
			"/api/notifications/read-all"
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"전체 알림 읽음 처리 실패";
		throw new Error(message);
	}
};

/**
 * 알림 삭제
 * DELETE /api/notifications/{id}
 */
export const deleteNotification = async (
	notificationId: number
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			`/api/notifications/${notificationId}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"알림 삭제 실패";
		throw new Error(message);
	}
};

// ============ FCM 토큰 API ============

/**
 * FCM 토큰 등록
 * POST /api/notifications/fcm-token
 */
export const registerFcmToken = async (
	reqData: RegisterFcmTokenRequest
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.post<ApiResponse<null>>(
			"/api/notifications/fcm-token",
			reqData
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"FCM 토큰 등록 실패";
		throw new Error(message);
	}
};

/**
 * FCM 토큰 삭제
 * DELETE /api/notifications/fcm-token
 */
export const deleteFcmToken = async (
	reqData: DeleteFcmTokenRequest
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			"/api/notifications/fcm-token",
			{ data: reqData }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"FCM 토큰 삭제 실패";
		throw new Error(message);
	}
};
