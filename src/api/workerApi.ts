import { AxiosError } from "axios";
import api from "./axios";
import type { ApiResponse } from "../types/api.types";
import type {
	ContractListItem,
	ContractDetail,
	CorrectionRequestParams,
	CorrectionRequestData,
} from "../types/worker/api.types";

/**
 * 근로자 계약 목록 조회
 */
export const getContracts = async (): Promise<
	ApiResponse<ContractListItem[]>
> => {
	try {
		const { data } = await api.get<ApiResponse<ContractListItem[]>>(
			"/api/worker/contracts"
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<
			ApiResponse<ContractListItem[]>
		>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 목록 조회 실패";

		throw new Error(message);
	}
};

/**
 * 계약 상세 조회 (근무지명 포함)
 */
export const getContractDetail = async (
	contractId: number
): Promise<ApiResponse<ContractDetail>> => {
	try {
		const { data } = await api.get<ApiResponse<ContractDetail>>(
			`/api/worker/contracts/${contractId}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<ContractDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 상세 조회 실패";

		throw new Error(message);
	}
};

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
