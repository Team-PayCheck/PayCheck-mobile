import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type {
  NotificationSettings,
  NotificationSettingsUpdateRequest,
} from "./types";

/**
 * 내 알림 설정 조회
 * GET /api/settings/me
 */
export const getNotificationSettings = async (): Promise<ApiResponse<NotificationSettings>> => {
  try {
    const { data } = await api.get<ApiResponse<NotificationSettings>>("/api/settings/me");
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<NotificationSettings>>;
    const message = axiosError.response?.data?.error?.message ?? "알림 설정 조회에 실패했습니다.";
    return { success: false, error: { code: "ERROR", message, fieldErrors: [] } };
  }
};

/**
 * 내 알림 설정 수정
 * PUT /api/settings/me
 */
export const updateNotificationSettings = async (
  reqData: NotificationSettingsUpdateRequest
): Promise<ApiResponse<NotificationSettings>> => {
  try {
    const { data } = await api.put<ApiResponse<NotificationSettings>>("/api/settings/me", reqData);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<NotificationSettings>>;
    const message = axiosError.response?.data?.error?.message ?? "알림 설정 수정에 실패했습니다.";
    return { success: false, error: { code: "ERROR", message, fieldErrors: [] } };
  }
};
