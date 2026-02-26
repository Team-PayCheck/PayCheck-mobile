import { AxiosError } from "axios";
import api from "../axios";
import type { ApiResponse } from "../../types/api.types";
import type {
	WorkplaceListItem,
	WorkplaceDetail,
	CreateWorkplaceRequest,
	UpdateWorkplaceRequest,
	ContractWorker,
	Contract,
	CreateContractRequest,
	UpdateContractRequest,
	CorrectionRequestListItem,
	CorrectionRequestDetail,
	CorrectionRequestPage,
	CorrectionRequestStatus,
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
	const { data } = await api.post<ApiResponse<WorkplaceDetail>>(
		"/api/employer/workplaces",
		{
			businessNumber: reqData.businessNumber,
			businessName: reqData.businessName,
			name: reqData.workplaceName,
			address: reqData.address,
			colorCode: reqData.colorCode,
			isLessThanFiveEmployees: reqData.isLessThanFiveEmployees ?? false,
		}
	);
	return data;
};

/**
 * 사업장 수정
 * PUT /api/employer/workplaces/{id}
 */
export const updateWorkplace = async (
	id: number,
	reqData: UpdateWorkplaceRequest
): Promise<ApiResponse<WorkplaceDetail>> => {
	const { data } = await api.put<ApiResponse<WorkplaceDetail>>(
		`/api/employer/workplaces/${id}`,
		{
			businessName: reqData.businessName,
			name: reqData.workplaceName,
			address: reqData.address,
			colorCode: reqData.colorCode,
			isLessThanFiveEmployees: reqData.isLessThanFiveEmployees,
		}
	);
	return data;
};

/**
 * 사업장 삭제
 * DELETE /api/employer/workplaces/{id}
 */
export const deleteWorkplace = async (
	id: number
): Promise<ApiResponse<null>> => {
	const { data } = await api.delete<ApiResponse<null>>(
		`/api/employer/workplaces/${id}`
	);
	return data;
};

// ============ 계약 (Contract) ============

/**
 * 사업장별 근로자(계약) 목록 조회
 * GET /api/employer/workplaces/{workplaceId}/workers
 */
export const getContractsByWorkplace = async (
	workplaceId: number | string
): Promise<ApiResponse<ContractWorker[]>> => {
	const { data } = await api.get<ApiResponse<ContractWorker[]>>(
		`/api/employer/workplaces/${workplaceId}/workers`
	);
	return data;
};

/**
 * 계약 상세 조회
 * GET /api/employer/contracts/{id}
 */
export const getContract = async (
	id: number | string
): Promise<ApiResponse<Contract>> => {
	const { data } = await api.get<ApiResponse<Contract>>(
		`/api/employer/contracts/${id}`
	);
	return data;
};

/**
 * 계약 생성 (근무자 추가)
 * POST /api/employer/workplaces/{workplaceId}/workers
 */
export const createContract = async (
	workplaceId: number | string,
	reqData: CreateContractRequest
): Promise<ApiResponse<Contract>> => {
	const { data } = await api.post<ApiResponse<Contract>>(
		`/api/employer/workplaces/${workplaceId}/workers`,
		reqData
	);
	return data;
};

/**
 * 계약 수정
 * PUT /api/employer/contracts/{id}
 */
export const updateContract = async (
	id: number | string,
	reqData: UpdateContractRequest
): Promise<ApiResponse<Contract>> => {
	const { data } = await api.put<ApiResponse<Contract>>(
		`/api/employer/contracts/${id}`,
		reqData
	);
	return data;
};

/**
 * 계약 삭제 (퇴사 처리)
 * DELETE /api/employer/contracts/{id}
 */
export const deleteContract = async (
	id: number | string
): Promise<ApiResponse<null>> => {
	const { data } = await api.delete<ApiResponse<null>>(
		`/api/employer/contracts/${id}`
	);
	return data;
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
	const { data } = await api.get<ApiResponse<CorrectionRequestListItem[]>>(
		`/api/employer/workplaces/${workplaceId}/pending-approvals`,
		{ params: type ? { type } : {} }
	);
	return data;
};

/**
 * 사업장별 정정요청 목록 조회 (페이징)
 * GET /api/employer/workplaces/{workplaceId}/correction-requests
 */
export const getCorrectionRequests = async (
	workplaceId: number,
	params?: { status?: CorrectionRequestStatus; page?: number; size?: number; sort?: string }
): Promise<ApiResponse<CorrectionRequestPage>> => {
	const { data } = await api.get<ApiResponse<CorrectionRequestPage>>(
		`/api/employer/workplaces/${workplaceId}/correction-requests`,
		{ params }
	);
	return data;
};

/**
 * 정정요청 상세 조회
 * GET /api/employer/correction-requests/{id}
 */
export const getCorrectionRequestDetail = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	const { data } = await api.get<ApiResponse<CorrectionRequestDetail>>(
		`/api/employer/correction-requests/${id}`
	);
	return data;
};

/**
 * 정정요청 승인
 * PUT /api/employer/correction-requests/{id}/approve
 */
export const approveCorrectionRequest = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	const { data } = await api.put<ApiResponse<CorrectionRequestDetail>>(
		`/api/employer/correction-requests/${id}/approve`
	);
	return data;
};

/**
 * 정정요청 거절
 * PUT /api/employer/correction-requests/{id}/reject
 */
export const rejectCorrectionRequest = async (
	id: number
): Promise<ApiResponse<CorrectionRequestDetail>> => {
	const { data } = await api.put<ApiResponse<CorrectionRequestDetail>>(
		`/api/employer/correction-requests/${id}/reject`
	);
	return data;
};
