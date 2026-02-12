import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};

// 카카오 네이티브 SDK 설정
export const KAKAO_CONFIG = {
  APP_KEY: (env.kakaoAppKey as string) || '',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
