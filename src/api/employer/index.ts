import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type {
	WorkplaceListItem,
	WorkplaceDetail,
	CreateWorkplaceRequest,
	UpdateWorkplaceRequest,
	CreateWorkRecordRequest,
	UpdateWorkRecordRequest,
	ContractWorker,
	Contract,
	CreateContractRequest,
	UpdateContractRequest,
	CorrectionRequestListItem,
	CorrectionRequestDetail,
	CorrectionRequestStatus,
	CreatePaymentRequest,
	SalaryPaymentItem,
	PaymentRecord,
	PaymentListItem,
	SalaryDetail,
} from "./types";

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

/**
 * 사업장 생성
 * POST /api/employer/workplaces
 */
export const createWorkplace = async (
	reqData: CreateWorkplaceRequest
): Promise<ApiResponse<WorkplaceDetail>> => {
	try {
		const { data } = await api.post<ApiResponse<WorkplaceDetail>>(
			"/api/employer/workplaces",
			{
				businessNumber: reqData.businessNumber,
				name: reqData.name,
				address: reqData.address,
				colorCode: reqData.colorCode,
				isLessThanFiveEmployees: reqData.isLessThanFiveEmployees,
			}
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkplaceDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"사업장 등록 실패";
		throw new Error(message);
	}
};

/**
 * 사업장 수정
 * PUT /api/employer/workplaces/{id}
 */
export const updateWorkplace = async (
	id: number,
	reqData: UpdateWorkplaceRequest
): Promise<ApiResponse<WorkplaceDetail>> => {
	try {
		const { data } = await api.put<ApiResponse<WorkplaceDetail>>(
			`/api/employer/workplaces/${id}`,
			{
				name: reqData.name,
				address: reqData.address,
				colorCode: reqData.colorCode,
				isLessThanFiveEmployees: reqData.isLessThanFiveEmployees,
			}
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<WorkplaceDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"사업장 수정 실패";
		throw new Error(message);
	}
};

/**
 * 사업장 삭제
 * DELETE /api/employer/workplaces/{id}
 */
export const deleteWorkplace = async (
	id: number
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			`/api/employer/workplaces/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"사업장 삭제 실패";
		throw new Error(message);
	}
};

// ============ 계약 (Contract) ============

/**
 * 사업장별 근로자(계약) 목록 조회
 * GET /api/employer/workplaces/{workplaceId}/workers
 */
export const getContractsByWorkplace = async (
	workplaceId: number | string
): Promise<ApiResponse<ContractWorker[]>> => {
	try {
		const { data } = await api.get<ApiResponse<ContractWorker[]>>(
			`/api/employer/workplaces/${workplaceId}/workers`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<ContractWorker[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"근로자 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 계약 상세 조회
 * GET /api/employer/contracts/{id}
 */
export const getContract = async (
	id: number | string
): Promise<ApiResponse<Contract>> => {
	try {
		const { data } = await api.get<ApiResponse<Contract>>(
			`/api/employer/contracts/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<Contract>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 상세 조회 실패";
		throw new Error(message);
	}
};

/**
 * 계약 생성 (근무자 추가)
 * POST /api/employer/workplaces/{workplaceId}/workers
 */
export const createContract = async (
	workplaceId: number | string,
	reqData: CreateContractRequest
): Promise<ApiResponse<Contract>> => {
	try {
		const { data } = await api.post<ApiResponse<Contract>>(
			`/api/employer/workplaces/${workplaceId}/workers`,
			reqData
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<Contract>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 생성 실패";
		throw new Error(message);
	}
};

/**
 * 계약 수정
 * PUT /api/employer/contracts/{id}
 */
export const updateContract = async (
	id: number | string,
	reqData: UpdateContractRequest
): Promise<ApiResponse<Contract>> => {
	try {
		const { data } = await api.put<ApiResponse<Contract>>(
			`/api/employer/contracts/${id}`,
			reqData
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<Contract>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 수정 실패";
		throw new Error(message);
	}
};

/**
 * 계약 삭제 (퇴사 처리)
 * DELETE /api/employer/contracts/{id}
 */
export const deleteContract = async (
	id: number | string
): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete<ApiResponse<null>>(
			`/api/employer/contracts/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<null>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계약 삭제 실패";
		throw new Error(message);
	}
};

// ============ 근무 기록 (Work Record) ============

/**
 * 사업장별 근무 기록 조회 (캘린더)
 * GET /api/employer/work-records?workplaceId={}&startDate={}&endDate={}
 */
export const getWorkRecords = async (
	workplaceId: number | string,
	startDate: string,
	endDate: string
) => {
	try {
		const { data } = await api.get(
			"/api/employer/work-records",
			{ params: { workplaceId, startDate, endDate } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"근무 기록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 근무 기록 생성
 * POST /api/employer/work-records
 */
export const createWorkRecord = async (reqData: CreateWorkRecordRequest) => {
	try {
		const { data } = await api.post("/api/employer/work-records", reqData);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"근무 기록 생성 실패";
		throw new Error(message);
	}
};

/**
 * 근무 기록 수정
 * PUT /api/employer/work-records/{id}
 */
export const updateWorkRecord = async (
	id: number,
	reqData: UpdateWorkRecordRequest
) => {
	try {
		const { data } = await api.put(`/api/employer/work-records/${id}`, reqData);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"근무 기록 수정 실패";
		throw new Error(message);
	}
};

/**
 * 근무 기록 삭제
 * DELETE /api/employer/work-records/{id}
 */
export const deleteWorkRecord = async (id: number) => {
	try {
		const { data } = await api.delete(`/api/employer/work-records/${id}`);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"근무 기록 삭제 실패";
		throw new Error(message);
	}
};

// ============ 정정 요청 (Correction Request) ============

/**
 * 승인 대기중인 모든 요청 조회 (통합)
 * GET /api/employer/workplaces/{workplaceId}/pending-approvals
 */
export const getPendingApprovals = async (
	workplaceId: number,
	type?: "CREATE" | "UPDATE" | "DELETE"
): Promise<ApiResponse<CorrectionRequestListItem[]>> => {
	try {
		const { data } = await api.get<ApiResponse<CorrectionRequestListItem[]>>(
			`/api/employer/workplaces/${workplaceId}/pending-approvals`,
			{ params: type ? { type } : {} }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestListItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"승인 대기 요청 조회 실패";
		throw new Error(message);
	}
};

/**
 * 사업장별 정정요청 목록 조회
 * GET /api/employer/workplaces/{workplaceId}/correction-requests
 */
export const getCorrectionRequests = async (
	workplaceId: number,
	params?: { status?: CorrectionRequestStatus }
): Promise<ApiResponse<CorrectionRequestListItem[]>> => {
	try {
		const { data } = await api.get<ApiResponse<CorrectionRequestListItem[]>>(
			`/api/employer/workplaces/${workplaceId}/correction-requests`,
			{ params }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestListItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 정정요청 상세 조회
 * GET /api/employer/correction-requests/{id}
 */
export const getCorrectionRequestDetail = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	try {
		const { data } = await api.get<ApiResponse<CorrectionRequestDetail>>(
			`/api/employer/correction-requests/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 상세 조회 실패";
		throw new Error(message);
	}
};

/**
 * 정정요청 승인
 * PUT /api/employer/correction-requests/{id}/approve
 */
export const approveCorrectionRequest = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	try {
		const { data } = await api.put<ApiResponse<CorrectionRequestDetail>>(
			`/api/employer/correction-requests/${id}/approve`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 승인 실패";
		throw new Error(message);
	}
};

/**
 * 정정요청 거절
 * PUT /api/employer/correction-requests/{id}/reject
 */
export const rejectCorrectionRequest = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	try {
		const { data } = await api.put<ApiResponse<CorrectionRequestDetail>>(
			`/api/employer/correction-requests/${id}/reject`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<CorrectionRequestDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"정정요청 거절 실패";
		throw new Error(message);
	}
};

// ============ 송금 (Payment) ============

/**
 * 사업장별 연월 급여+송금 현황 조회
 * GET /api/employer/salaries/year-month
 */
export const getSalariesByYearMonth = async (
	workplaceId: number,
	year: number,
	month: number
): Promise<ApiResponse<SalaryPaymentItem[]>> => {
	try {
		const { data } = await api.get<ApiResponse<SalaryPaymentItem[]>>(
			"/api/employer/salaries/year-month",
			{ params: { workplaceId, year, month } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<SalaryPaymentItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"급여 목록 조회 실패";
		throw new Error(message);
	}
};

/**
 * 급여 상세 조회
 * GET /api/employer/salaries/{id}
 */
export const getSalaryById = async (id: number): Promise<ApiResponse<SalaryDetail>> => {
	try {
		const { data } = await api.get<ApiResponse<SalaryDetail>>(
			`/api/employer/salaries/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<SalaryDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"급여 상세 조회 실패";
		throw new Error(message);
	}
};

/**
 * 급여 자동 계산
 * POST /api/employer/salaries/contracts/{contractId}/calculate
 */
export const calculateSalary = async (
	contractId: number,
	year: number,
	month: number
): Promise<ApiResponse<SalaryDetail>> => {
	try {
		const { data } = await api.post<ApiResponse<SalaryDetail>>(
			`/api/employer/salaries/contracts/${contractId}/calculate`,
			null,
			{ params: { year, month } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<SalaryDetail>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"급여 계산 실패";
		throw new Error(message);
	}
};

/**
 * 송금 내역 상세 조회 (tossLink 포함)
 * GET /api/employer/payments/{id}
 */
export const getPaymentById = async (id: number): Promise<ApiResponse<PaymentRecord>> => {
	try {
		const { data } = await api.get<ApiResponse<PaymentRecord>>(
			`/api/employer/payments/${id}`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<PaymentRecord>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"송금 내역 조회 실패";
		throw new Error(message);
	}
};

/**
 * 사업장별 연월 송금 현황 조회
 * GET /api/employer/payments/year-month
 */
export const getPaymentsByYearMonth = async (
	workplaceId: number,
	year: number,
	month: number
): Promise<ApiResponse<PaymentListItem[]>> => {
	try {
		const { data } = await api.get<ApiResponse<PaymentListItem[]>>(
			"/api/employer/payments/year-month",
			{ params: { workplaceId, year, month } }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<PaymentListItem[]>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"송금 현황 조회 실패";
		throw new Error(message);
	}
};

/**
 * 급여 송금 처리 (토스 딥링크 생성)
 * POST /api/employer/payments
 */
export const createPayment = async (reqData: CreatePaymentRequest): Promise<ApiResponse<PaymentRecord>> => {
	try {
		const { data } = await api.post<ApiResponse<PaymentRecord>>("/api/employer/payments", reqData);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<PaymentRecord>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"송금 생성 실패";
		throw new Error(message);
	}
};

/**
 * 급여 송금 완료 처리
 * PUT /api/employer/payments/{id}/complete
 */
export const completePayment = async (id: number): Promise<ApiResponse<PaymentRecord>> => {
	try {
		const { data } = await api.put<ApiResponse<PaymentRecord>>(
			`/api/employer/payments/${id}/complete`
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<PaymentRecord>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"송금 완료 처리 실패";
		throw new Error(message);
	}
};
