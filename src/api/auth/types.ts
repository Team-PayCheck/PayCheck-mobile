// 인증 성공 데이터 (백엔드 API 응답 형태)
export interface AuthSuccessData {
	accessToken: string;
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
