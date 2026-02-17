import { AxiosError } from "axios";
import api from "./axios";
import type { ApiResponse } from "../types/api.types";
import type {
	CorrectionRequestParams,
	CorrectionRequestData,
} from "../types/worker/api.types";

/**
 * 정정요청 생성 (근무 추가/수정/삭제 요청)
 */
export const createCorrectionRequest = async (
	params: CorrectionRequestParams
): Promise<ApiResponse<CorrectionRequestData>> => {
	try {
		const { data } = await api.post<ApiResponse<CorrectionRequestData>>(
			"/api/worker/correction-requests",
			params
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<
			ApiResponse<CorrectionRequestData>
		>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 실패";

		throw new Error(message);
	}
};
