import type { InternalAxiosRequestConfig } from "axios";

// API 응답 공통 타입
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		code?: string;
		fieldErrors?: FieldError[];
	};
}

// 필드별 유효성 검증 에러
export interface FieldError {
	field: string;
	message: string;
}

// Axios 커스텀 요청 설정 (_retry 속성 추가)
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

// Refresh Token 대기 요청 관리
export interface RefreshSubscriber {
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}
