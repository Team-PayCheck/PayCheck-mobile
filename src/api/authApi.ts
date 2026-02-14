import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import api from "./axios";
import type {
	ApiResponse,
	AuthSuccessData,
	UserInfo,
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
		await AsyncStorage.multiRemove(["@access_token", "@user_info"]);
	}
};

// ============ 토큰 관련 유틸 ============

/** 백엔드에서 받은 액세스 토큰을 AsyncStorage에 저장 */
export const saveAccessToken = (token: string): Promise<void> =>
	AsyncStorage.setItem("@access_token", token);

/** 저장된 액세스 토큰 조회 */
export const getAccessToken = (): Promise<string | null> =>
	AsyncStorage.getItem("@access_token");

/** 로그아웃 (토큰 삭제) */
export const clearAccessToken = (): Promise<void> =>
	AsyncStorage.removeItem("@access_token");

// ============ 사용자 정보 관련 ============

/** 사용자 정보 저장 */
export const saveUserInfo = (
	userType: "EMPLOYER" | "WORKER",
	userId: number,
	userName: string
): Promise<void> => {
	const userInfo: UserInfo = { userType, userId, userName };
	return AsyncStorage.setItem("@user_info", JSON.stringify(userInfo));
};

/** 저장된 사용자 정보 조회 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
	const userInfoStr = await AsyncStorage.getItem("@user_info");
	if (!userInfoStr) return null;
	try {
		return JSON.parse(userInfoStr) as UserInfo;
	} catch (error) {
		console.error("Failed to parse user info:", error);
		return null;
	}
};

/** 사용자 정보 삭제 (로그아웃 시) */
export const clearUserInfo = (): Promise<void> =>
	AsyncStorage.removeItem("@user_info");
