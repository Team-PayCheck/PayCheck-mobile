// 계약 목록 아이템 (GET /api/worker/contracts)
export interface ContractListItem {
	id: number;
	workerName: string;
	workerCode: string;
	workerPhone: string;
	hourlyWage: number;
	contractStartDate: string;
	contractEndDate: string | null;
	isActive: boolean;
}

// 계약 상세 (GET /api/worker/contracts/{id})
export interface ContractDetail {
	id: number;
	workplaceId: number;
	workplaceName: string;
	workerId: number;
	workerName: string;
	workerCode: string;
	workerPhone: string;
	hourlyWage: number;
	workSchedules: string;
	contractStartDate: string;
	contractEndDate: string | null;
	paymentDay: number;
	isActive: boolean;
	payrollDeductionType: string;
}

// 정정요청 타입
export type RequestType = "CREATE" | "UPDATE" | "DELETE";
export type CorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

// 정정요청 Request (CREATE)
export interface CreateCorrectionRequest {
	type: "CREATE";
	contractId: number;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes?: number;
	requestedMemo?: string;
}

// 정정요청 Request (UPDATE)
export interface UpdateCorrectionRequest {
	type: "UPDATE";
	workRecordId: number;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes?: number;
	requestedMemo?: string;
}

// 정정요청 Request (DELETE)
export interface DeleteCorrectionRequest {
	type: "DELETE";
	workRecordId: number;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
}

export type CorrectionRequestParams =
	| CreateCorrectionRequest
	| UpdateCorrectionRequest
	| DeleteCorrectionRequest;

// 정정요청 Response data
export interface CorrectionRequestData {
	id: number;
	type: RequestType;
	workRecordId: number | null;
	contractId: number | null;
	originalWorkDate: string | null;
	originalStartTime: string | null;
	originalEndTime: string | null;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes: number | null;
	requestedMemo: string | null;
	status: CorrectionStatus;
	requester: {
		id: number;
		name: string;
	};
	reviewedAt: string | null;
	createdAt: string;
}
