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
    code?: string;
  };
}

interface LoginError {
  status?: number;
  message: string;
  code?: string;
}

interface UserInfo {
  userId: number;
  userName: string;
  userType: 'EMPLOYER' | 'WORKER';
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
      data: response.data.success
        ? {
            accessToken: response.data.data.accessToken,
            userType: response.data.data.userType as 'EMPLOYER' | 'WORKER',
            userId: response.data.data.userId,
            userName: response.data.data.name,
          }
        : undefined,
      error: !response.data.success
        ? {
            message: response.data.error?.message,
            code: response.data.error?.code,
          }
        : undefined,
    } as KakaoLoginResponse;
  } catch (error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      '로그인 실패';
    const code = axiosError.response?.data?.error?.code;

    throw {
      status,
      message,
      code,
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

/**
 * 카카오 액세스 토큰과 사용자 정보로 회원가입 요청
 * @param kakaoAccessToken - 카카오에서 받은 액세스 토큰
 * @param userType - 사용자 타입 ('EMPLOYER' | 'WORKER')
 * @param phone - 전화번호
 * @param bankName - 은행명
 * @param accountNumber - 계좌번호
 * @param profileImageUrl - 프로필 이미지 URL
 * @returns 회원가입 결과 (성공 시 앱 액세스 토큰 반환)
 */
export const kakaoRegisterWithToken = async (
  kakaoAccessToken: string,
  userType: 'EMPLOYER' | 'WORKER',
  phone: string,
  bankName: string,
  accountNumber: string,
  profileImageUrl: string
): Promise<KakaoLoginResponse> => {
  try {
    const response = await axios.post<any>(
      `${API_BASE_URL}/api/auth/kakao/register`,
      {
        kakaoAccessToken,
        userType,
        phone,
        bankName,
        accountNumber,
        profileImageUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: response.data.success,
      data: response.data.success
        ? {
            accessToken: response.data.data.accessToken,
            userType: response.data.data.userType as 'EMPLOYER' | 'WORKER',
            userId: response.data.data.userId,
            userName: response.data.data.name,
          }
        : undefined,
      error: !response.data.success
        ? {
            message: response.data.error?.message,
            code: response.data.error?.code,
          }
        : undefined,
    } as KakaoLoginResponse;
  } catch (error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      '회원가입 실패';
    const code = axiosError.response?.data?.error?.code;

    throw {
      status,
      message,
      code,
      response: axiosError.response,
    } as LoginError & { response?: any };
  }
};

// 사용자 정보 저장
export const saveUserInfo = async (
  userType: 'EMPLOYER' | 'WORKER',
  userId: number,
  userName: string
): Promise<void> => {
  const userInfo: UserInfo = { userType, userId, userName };
  await AsyncStorage.setItem('@user_info', JSON.stringify(userInfo));
};

// 저장된 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo | null> => {
  const userInfoStr = await AsyncStorage.getItem('@user_info');
  if (!userInfoStr) return null;
  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
};

// 사용자 정보 삭제 (로그아웃 시)
export const clearUserInfo = async (): Promise<void> => {
  await AsyncStorage.removeItem('@user_info');
};
