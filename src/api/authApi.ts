import { AxiosError } from "axios";
import CookieManager from "@react-native-cookies/cookies";
import api from "./axios";
import { getAuthState } from "../stores/authStore";
import type {
	ApiResponse,
	AuthSuccessData,
	KakaoRegisterParams,
	LoginError,
} from "../types/api.types";

/**
 * 카카오 액세스 토큰으로 백엔드 로그인 요청
 */
export const kakaoLoginWithToken = async (
	kakaoAccessToken: string
): Promise<ApiResponse<AuthSuccessData>> => {
	try {
		const { data } = await api.post<ApiResponse<AuthSuccessData>>(
			"/api/auth/kakao/login",
			{ kakaoAccessToken }
		);
		return data;
	} catch (error) {
		const axiosError = error as AxiosError<ApiResponse<AuthSuccessData>>;
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
		await CookieManager.clearAll();
	}
};

/**
 * 회원 탈퇴
 */
export const deleteMyAccount = async () => {
	const { data } = await api.delete("/api/users/me");
	return data;
};
