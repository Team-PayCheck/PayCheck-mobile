import axios, {
	AxiosResponse,
	AxiosError,
	InternalAxiosRequestConfig,
} from "axios";
import CookieManager from "@react-native-cookies/cookies";
import Constants from "expo-constants";
import { getAuthState } from "../stores/authStore";
import type {
	ApiResponse,
	CustomAxiosRequestConfig,
	RefreshSubscriber,
} from "../types/api.types";
import type { AuthSuccessData } from "./auth/types";

const env = Constants.expoConfig?.extra || {};
const API_BASE_URL =
	(env.backendApiUrl as string) || "http://localhost:8000";

// Axios 인스턴스 생성
export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true, // 쿠키 전송 활성화
});

// 로그아웃 콜백 (네비게이션 처리용)
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
	logoutCallback = callback;
};

// 인증 실패 시 처리 (Zustand + 쿠키 삭제)
const handleAuthFailure = async () => {
	getAuthState().logout();
	await CookieManager.clearAll();
	logoutCallback?.();
};

// 요청 인터셉터: Access Token 자동 첨부 (Zustand에서 동기적으로 가져옴)
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const { accessToken } = getAuthState();
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// Refresh 중복 요청 방지
let isRefreshing = false;

// 대기 중인 요청들 관리
let refreshSubscribers: RefreshSubscriber[] = [];

// 대기 중인 요청들에 새 토큰 전달
const onRefreshed = (token: string) => {
	refreshSubscribers.forEach((subscriber) => subscriber.resolve(token));
	refreshSubscribers = [];
};

// 대기 중인 요청들 reject 처리
const onRefreshFailed = (error: unknown) => {
	refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
	refreshSubscribers = [];
};

// 대기 요청 추가
const addRefreshSubscriber = (subscriber: RefreshSubscriber) => {
	refreshSubscribers.push(subscriber);
};

// 응답 인터셉터: 401 에러 시 토큰 갱신
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as
			| CustomAxiosRequestConfig
			| undefined;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		// 401 에러 && 재시도가 아닌 경우
		if (error.response?.status === 401 && !originalRequest._retry) {
			// 이미 갱신 중이면 대기열에 추가
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					addRefreshSubscriber({
						resolve: (token: string) => {
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${token}`;
							}
							resolve(api.request(originalRequest));
						},
						reject: (err: unknown) => reject(err),
					});
				});
			}

			// 토큰 갱신 시작
			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// Refresh Token(쿠키)으로 새 Access Token 요청
				const response = await axios.post<ApiResponse<AuthSuccessData>>(
					`${API_BASE_URL}/api/auth/refresh`,
					{},
					{ withCredentials: true }
				);

				const newAccessToken = response.data.data?.accessToken;
				if (!newAccessToken) {
					const noTokenError = new Error(
						"토큰 갱신 응답에 accessToken이 없습니다"
					);
					onRefreshFailed(noTokenError);
					await handleAuthFailure();
					return Promise.reject(noTokenError);
				}

				// 새 토큰 저장 (Zustand → 자동으로 AsyncStorage에도 persist)
				getAuthState().setAccessToken(newAccessToken);

				// 대기 중인 요청들에 새 토큰 전달
				onRefreshed(newAccessToken);

				// 원래 요청 재시도
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}
				return api.request(originalRequest);
			} catch (refreshError) {
				// 갱신 실패 → 대기 요청 모두 reject 후 로그아웃
				onRefreshFailed(refreshError);
				await handleAuthFailure();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default api;
