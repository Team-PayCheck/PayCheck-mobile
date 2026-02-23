// ============ 계약 관련 타입 ============

/** 급여 공제 유형 */
export type PayrollDeductionType = 'FREELANCER' | 'PART_TIME_NONE' | 'PART_TIME_TAX_ONLY' | 'PART_TIME_TAX_AND_INSURANCE';

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
	workplaceName?: string;
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
	payrollDeductionType: PayrollDeductionType;
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

/** 정정 요청 목록 조회 응답 아이템 (/api/worker/correction-requests) */
export interface CorrectionRequestResponse {
	id: number;
	workplaceName: string;
	type: RequestType;
	workRecordId: number | null;
	/** YYYY-MM-DD */
	workDate: string;
	/** HH:mm:ss - 기존 출근 시간 (UPDATE/DELETE 시 존재) */
	originalStartTime: string | null;
	/** HH:mm:ss - 기존 퇴근 시간 (UPDATE/DELETE 시 존재) */
	originalEndTime: string | null;
	/** HH:mm:ss - 요청 출근 시간 */
	requestedStartTime: string;
	/** HH:mm:ss - 요청 퇴근 시간 */
	requestedEndTime: string;
	status: CorrectionStatus;
	requester: {
		id: number;
		name: string;
	};
	/** ISO-8601 */
	createdAt: string;
}

// ============ 근무 기록 관련 타입 ============

/** 근무 기록 조회 응답 (/api/worker/work-records) */
export interface WorkRecordsResponse {
	id: number;
	contractId: number;
	workerCode: string;
	workplaceName: string;
	workDate: string;
	startTime: string;
	endTime: string;
	breakMinutes: number;
	totalWorkMinutes: number;
	status: string;
	isModified: boolean;
	wage?: number;
	memo?: string;
}

// ============ 급여 관련 타입 ============

/** 급여 목록 조회 응답 아이템 (/api/worker/salaries) */
export interface SalaryListItem {
	id: number;
	contractId: number;
	workerName: string;
	year: number;
	month: number;
	totalGrossPay: number;
	netPay: number;
	paymentDueDate: string;
}

/** 급여 상세 조회 응답 (/api/worker/salaries/{id}) */
export interface SalaryDetailResponse {
	id: number;
	contractId: number;
	workerId: number;
	workerName: string;
	workplaceId: number;
	workplaceName: string;
	year: number;
	month: number;
	totalWorkHours: number;
	basePay: number;
	overtimePay: number;
	nightPay: number;
	holidayPay: number;
	totalGrossPay: number;
	fourMajorInsurance: number;
	incomeTax: number;
	localIncomeTax: number;
	totalDeduction: number;
	netPay: number;
	paymentDueDate: string;
}

/** 급여 자동 계산 응답 (POST /api/worker/salaries/contracts/{contractId}/calculate) */
export type SalaryCalculateResponse = SalaryDetailResponse;

// ============ 송금 관련 타입 ============

/** 송금 상태 */
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

/** 송금 내역 조회 응답 아이템 (/api/worker/payments) */
export interface PaymentResponse {
	id: number;
	salaryId: number;
	workerName: string;
	year: number;
	month: number;
	netPay: number;
	status: PaymentStatus;
	/** 송금 완료 시각 (ISO-8601). 미완료 시 null */
	paymentDate: string | null;
	/** status === 'COMPLETED'이면 true */
	isPaid: boolean;
}
