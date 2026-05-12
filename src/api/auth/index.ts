import { AxiosError } from "axios";
import api from "../axios";
import { getAuthState } from "../../stores/authStore";
import type {
	ApiResponse,
} from "../../types/api.types";
import type {
	AuthSuccessData,
	KakaoLoginResult,
	KakaoRegisterParams,
	LoginError,
} from "./types";

/**
 * 카카오 액세스 토큰으로 백엔드 로그인 요청
 * 응답 status가 "LOGGED_IN"이면 토큰 정보, "WITHDRAWN_PENDING"이면 탈퇴 보류 계정 정보를 반환한다.
 * 신규 사용자는 여전히 404(USER_NOT_FOUND)로 catch 블록에서 던져진다.
 */
export const kakaoLoginWithToken = async (
	kakaoAccessToken: string
): Promise<ApiResponse<KakaoLoginResult>> => {
	try {
		const { data } = await api.post<ApiResponse<KakaoLoginResult>>(
			"/api/auth/kakao/login",
			{ kakaoAccessToken }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<KakaoLoginResult>>;
		const status = axiosError.response?.status;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"로그인 실패";
		const code = axiosError.response?.data?.error?.code;

		throw { status, message, code } as LoginError;
	}
};

/**
 * 탈퇴 보류 상태 카카오 계정 복구
 */
export const kakaoRestoreWithToken = async (
	kakaoAccessToken: string
): Promise<ApiResponse<AuthSuccessData>> => {
	try {
		const { data } = await api.post<ApiResponse<AuthSuccessData>>(
			"/api/auth/kakao/restore",
			{ kakaoAccessToken }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<AuthSuccessData>>;
		const status = axiosError.response?.status;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"계정 복구 실패";
		const code = axiosError.response?.data?.error?.code;

		throw { status, message, code } as LoginError;
	}
};

/**
 * 탈퇴 계정을 완전히 삭제하고 새 계정으로 재가입
 */
export const kakaoPurgeAndRegisterWithToken = async (
	params: KakaoRegisterParams
): Promise<ApiResponse<AuthSuccessData>> => {
	try {
		const { data } = await api.post<ApiResponse<AuthSuccessData>>(
			"/api/auth/kakao/purge-and-register",
			params
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<AuthSuccessData>>;
		const status = axiosError.response?.status;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"재가입 실패";
		const code = axiosError.response?.data?.error?.code;

		throw { status, message, code } as LoginError;
	}
};

/**
 * 카카오 액세스 토큰과 사용자 정보로 회원가입 요청
 */
export const kakaoRegisterWithToken = async (
	params: KakaoRegisterParams
): Promise<ApiResponse<AuthSuccessData>> => {
	try {
		const { data } = await api.post<ApiResponse<AuthSuccessData>>(
			"/api/auth/kakao/register",
			params
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<AuthSuccessData>>;
		const status = axiosError.response?.status;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"회원가입 실패";
		const code = axiosError.response?.data?.error?.code;

		throw { status, message, code } as LoginError;
	}
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
	try {
		await api.post("/api/auth/logout", {});
	} finally {
		getAuthState().logout();
	}
};

/**
 * Dev 로그인 (개발 환경 전용)
 */
export const devLogin = async (
	userId: number,
	name: string,
	userType: string
): Promise<ApiResponse<AuthSuccessData>> => {
	try {
		const { data } = await api.post<ApiResponse<AuthSuccessData>>(
			"/api/auth/dev/login",
			{ userId, name, userType }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<AuthSuccessData>>;
		const message =
			axiosError.response?.data?.error?.message ||
			axiosError.message ||
			"Dev 로그인 실패";
		throw new Error(message);
	}
};

/**
 * 회원 탈퇴
 */
export const deleteMyAccount = async () => {
	try {
		const { data } = await api.delete("/api/auth/withdraw");
		return data;
	} catch (error) {
		const axiosError = error as AxiosError;
		const message =
			(axiosError.response?.data as any)?.error?.message ||
			axiosError.message ||
			"회원 탈퇴 실패";
		throw new Error(message);
	}
};
