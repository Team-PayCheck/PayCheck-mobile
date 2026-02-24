import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type { WorkplaceListItem, WorkplaceDetail } from "./types";

/**
 * 사업장(근무지) 목록 조회
 * GET /api/employer/workplaces
 */
export const getWorkplaces = async (): Promise<
	ApiResponse<WorkplaceListItem[]>
> => {
	try {
		const { data } = await api.get<ApiResponse<WorkplaceListItem[]>>(
			"/api/employer/workplaces"
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkplaceListItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"사업장 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 사업장(근무지) 상세 조회
 * GET /api/employer/workplaces/{id}
 */
export const getWorkplaceDetail = async (
	id: number
): Promise<ApiResponse<WorkplaceDetail>> => {
	try {
		const { data } = await api.get<ApiResponse<WorkplaceDetail>>(
			`/api/employer/workplaces/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkplaceDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"사업장 상세 조회 실패";
		throw new Error(message);
	}
};
