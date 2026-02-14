import type {
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
	InternalAxiosRequestConfig,
} from "axios";

// API 응답 공통 타입
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		code?: string;
	};
}

// 인증 성공 데이터 (백엔드 API 응답 형태)
export interface AuthSuccessData {
	accessToken: string;
	userType: "EMPLOYER" | "WORKER";
	userId: number;
	name: string;
}

// 사용자 정보
export interface UserInfo {
	userId: number;
	name: string;
	userType: "EMPLOYER" | "WORKER";
}

// 카카오 회원가입 파라미터
export interface KakaoRegisterParams {
	kakaoAccessToken: string;
	userType: "EMPLOYER" | "WORKER";
	phone: string;
	bankName: string;
	accountNumber: string;
	profileImageUrl: string;
}

// 로그인 에러 타입
export interface LoginError {
	status?: number;
	message: string;
	code?: string;
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

// Axios 타입 재export
export type {
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
	InternalAxiosRequestConfig,
};
