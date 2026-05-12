// 인증 성공 데이터 (백엔드 API 응답 형태)
export interface AuthSuccessData {
	accessToken: string;
	refreshToken?: string;
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
	name: string;
	userType: "EMPLOYER" | "WORKER";
	phone: string;
	bankName: string;
	accountNumber: string;
}

// 로그인 에러 타입
export interface LoginError {
	status?: number;
	message: string;
	code?: string;
}

// 탈퇴 보류 계정 정보 (카카오 로그인 시 WITHDRAWN_PENDING 응답)
export interface WithdrawnAccountInfo {
	name: string;
	userType: "EMPLOYER" | "WORKER";
	withdrawnAt: string;
}

// 카카오 로그인 응답 (status 분기 union)
export type KakaoLoginResult =
	| {
			status: "LOGGED_IN";
			accessToken: string;
			refreshToken?: string;
			userType: "EMPLOYER" | "WORKER";
			userId: number;
			name: string;
	  }
	| {
			status: "WITHDRAWN_PENDING";
			withdrawnAccount: WithdrawnAccountInfo;
	  };
