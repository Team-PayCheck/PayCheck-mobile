import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type {
	NoticeListResponse,
	NoticeDetailResponse,
	CreateNoticeRequest,
	UpdateNoticeRequest,
} from "./types";

/**
 * 사업장별 공지사항 목록 조회 (만료/삭제 제외)
 * GET /api/workplaces/{workplaceId}/notices
 */
export const getNotices = async (
	workplaceId: number
): Promise<ApiResponse<NoticeListResponse[]>> => {
	try {
		const { data } = await api.get<ApiResponse<NoticeListResponse[]>>(
			`/api/workplaces/${workplaceId}/notices`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<NoticeListResponse[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"공지사항 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 공지사항 단건 상세 조회
 * GET /api/notices/{noticeId}
 */
export const getNotice = async (
	noticeId: number
): Promise<ApiResponse<NoticeDetailResponse>> => {
	try {
		const { data } = await api.get<ApiResponse<NoticeDetailResponse>>(
			`/api/notices/${noticeId}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<NoticeDetailResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"공지사항 조회 실패";
		throw new Error(message);
	}
};

/**
 * 공지사항 생성
 * POST /api/workplaces/{workplaceId}/notices
 */
export const createNotice = async (
	workplaceId: number,
	reqData: CreateNoticeRequest
): Promise<ApiResponse<NoticeDetailResponse>> => {
	try {
		const { data } = await api.post<ApiResponse<NoticeDetailResponse>>(
			`/api/workplaces/${workplaceId}/notices`,
			reqData
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<NoticeDetailResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"공지사항 생성 실패";
		throw new Error(message);
	}
};

/**
 * 공지사항 수정 (부분 수정, 작성자 본인만 가능)
 * PATCH /api/notices/{noticeId}
 */
export const updateNotice = async (
	noticeId: number,
	reqData: UpdateNoticeRequest
): Promise<ApiResponse<NoticeDetailResponse>> => {
	try {
		const { data } = await api.patch<ApiResponse<NoticeDetailResponse>>(
			`/api/notices/${noticeId}`,
			reqData
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<NoticeDetailResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"공지사항 수정 실패";
		throw new Error(message);
	}
};

/**
 * 공지사항 삭제 (소프트 삭제, 작성자 본인만 가능)
 * DELETE /api/notices/{noticeId}
 */
export const deleteNotice = async (
	noticeId: number
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			`/api/notices/${noticeId}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"공지사항 삭제 실패";
		throw new Error(message);
	}
};
