import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};
const API_BASE_URL = (env.backendApiUrl as string) || 'http://localhost:3000';

interface KakaoLoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    userType: 'EMPLOYER' | 'WORKER';
    userId: number;
    userName: string;
  };
  error?: {
    message: string;
    code?: number;
  };
}

interface LoginError {
  status?: number;
  message: string;
}

/**
 * 카카오 액세스 토큰으로 백엔드 로그인 요청
 * @param kakaoAccessToken - 카카오에서 받은 액세스 토큰
 * @returns 로그인 결과 (성공 시 앱 액세스 토큰 반환)
 */
export const kakaoLoginWithToken = async (
  kakaoAccessToken: string
): Promise<KakaoLoginResponse> => {
  try {
    const response = await axios.post<any>(
      `${API_BASE_URL}/api/auth/kakao/login`,
      {
        kakaoAccessToken: kakaoAccessToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: response.data.success,
      data: {
        accessToken: response.data.data.accessToken,
        userType: response.data.data.userType as 'EMPLOYER' | 'WORKER',
        userId: response.data.data.userId,
        userName: response.data.data.name,
      },
    } as KakaoLoginResponse;
  } catch (error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      '로그인 실패';

    throw {
      status,
      message,
      response: axiosError.response,
    } as LoginError & { response?: any };
  }
};

// 백엔드에서 받은 액세스 토큰을 AsyncStorage에 저장
export const saveAccessToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('@access_token', token);
};

// 저장된 액세스 토큰 조회
export const getAccessToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem('@access_token');
};

// 로그아웃 (토큰 삭제)
export const clearAccessToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('@access_token');
};
