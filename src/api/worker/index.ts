import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type { WorkItem } from "../../types/worker.types";
import type {
	ContractListItem,
	ContractDetail,
	CorrectionRequestParams,
	CorrectionRequestData,
	CorrectionRequestResponse,
	CorrectionStatus,
	PaymentResponse,
	SalaryDetailResponse,
	SalaryCalculateResponse,
} from "./types";


/**
 * 근로자 코드로 조회
 */
export const getWorkerByCode = async (workerCode: string) => {
	try {
		const { data } = await api.get(`/api/workers/code/${workerCode}`);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"근로자 코드 조회 실패";
		throw new Error(message);
	}
};

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
 * 근무 기록 목록 조회 (기간별)
 */
export const getWorkRecords = async (
	startDate: string,
	endDate: string
): Promise<ApiResponse<WorkItem[]>> => {
	try {
		const { data } = await api.get<ApiResponse<WorkItem[]>>(
			"/api/worker/work-records",
			{ params: { startDate, endDate } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"근무 기록 조회 실패";

		throw new Error(message);
	}
};

/**
 * 근무 기록 상세 조회
 */
export const getWorkRecordDetail = async (
	id: number
): Promise<ApiResponse<WorkItem>> => {
	try {
		const { data } = await api.get<ApiResponse<WorkItem>>(
			`/api/worker/work-records/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkItem>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"근무 기록 상세 조회 실패";

		throw new Error(message);
	}
};

/**
 * 정정요청 목록 조회 (보낸 근무 요청)
 * GET /api/worker/correction-requests?status=PENDING
 */
export const getCorrectionRequests = async (
	status?: CorrectionStatus
): Promise<ApiResponse<CorrectionRequestResponse[]>> => {
	try {
		const { data } = await api.get<ApiResponse<CorrectionRequestResponse[]>>(
			"/api/worker/correction-requests",
			{ params: status ? { status } : undefined }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestResponse[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 정정요청 상세 조회
 * GET /api/worker/correction-requests/{id}
 */
export const getCorrectionRequestDetail = async (
	id: number
): Promise<ApiResponse<CorrectionRequestData>> => {
	try {
		const { data } = await api.get<ApiResponse<CorrectionRequestData>>(
			`/api/worker/correction-requests/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestData>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 상세 조회 실패";
		throw new Error(message);
	}
};

/**
 * 정정요청 취소 (PENDING 상태만 가능)
 * DELETE /api/worker/correction-requests/{id}
 */
export const deleteCorrectionRequest = async (
	id: number
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			`/api/worker/correction-requests/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 취소 실패";
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

/**
 * 급여 상세 조회
 * GET /api/worker/salaries/{salaryId}
 */
export const getSalaryDetail = async (
	salaryId: number
): Promise<ApiResponse<SalaryDetailResponse>> => {
	try {
		const { data } = await api.get<ApiResponse<SalaryDetailResponse>>(
			`/api/worker/salaries/${salaryId}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<SalaryDetailResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"급여 상세 조회 실패";
		throw new Error(message);
	}
};

/**
 * 급여 자동 계산
 * POST /api/worker/salaries/contracts/{contractId}/calculate?year=&month=
 */
export const calculateSalary = async (
	contractId: number,
	year: number,
	month: number
): Promise<ApiResponse<SalaryCalculateResponse>> => {
	try {
		const { data } = await api.post<ApiResponse<SalaryCalculateResponse>>(
			`/api/worker/salaries/contracts/${contractId}/calculate`,
			null,
			{ params: { year, month } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<SalaryCalculateResponse>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"급여 계산 실패";
		throw new Error(message);
	}
};

/**
 * 송금 내역 목록 조회
 * GET /api/worker/payments
 */
export const getPayments = async (): Promise<
	ApiResponse<PaymentResponse[]>
> => {
	try {
		const { data } = await api.get<ApiResponse<PaymentResponse[]>>(
			"/api/worker/payments"
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<PaymentResponse[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"송금 내역 조회 실패";
		throw new Error(message);
	}
};
