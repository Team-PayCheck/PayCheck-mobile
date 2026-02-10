import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra || {};

// 카카오 OAuth 설정
export const KAKAO_CONFIG = {
  REST_API_KEY: (env.kakaoRestApiKey as string) || '',
  REDIRECT_URI:
    (env.kakaoRedirectUri as string) ||
    'https://auth.expo.io/@TeamPayCheck/PayCheck-mobile',
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
