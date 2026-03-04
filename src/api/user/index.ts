import { AxiosError } from 'axios';
import { api } from '../axios';
import type { ApiResponse } from '../../types/api.types';
import type { UserUpdateRequest, WorkerUpdateRequest, UserResponse, WorkerResponse } from './types';

// 타입 re-export (다른 파일에서 import할 수 있도록)
export type {
  UserType,
  UserUpdateRequest,
  WorkerUpdateRequest,
  UserResponse,
  WorkerResponse,
} from './types';

// ============ API 함수 ============

// 사용자 프로필 조회
export const getUserProfile = async (): Promise<ApiResponse<UserResponse>> => {
  try {
    const { data } = await api.get('/api/users/me');
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<UserResponse>>;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "사용자 프로필 조회 실패";
    throw new Error(message);
  }
};

// 사용자 프로필 수정
export const updateUserProfile = async (userData: UserUpdateRequest): Promise<ApiResponse<UserResponse>> => {
  try {
    const { data } = await api.put('/api/users/me', userData);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<UserResponse>>;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "사용자 프로필 수정 실패";
    throw new Error(message);
  }
};

// 계좌 정보 수정 (근로자 전용)
export const updateAccountInfo = async (accountData: WorkerUpdateRequest): Promise<ApiResponse<WorkerResponse>> => {
  try {
    const { data } = await api.put('/api/users/me/account', accountData);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<WorkerResponse>>;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "계좌 정보 수정 실패";
    throw new Error(message);
  }
};
