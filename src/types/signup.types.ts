// 회원가입 단계
export type SignUpStep = 1 | 2 | 3 | 4 | 5;

// 사용자 유형
export type UserType = "WORKER" | "EMPLOYER";

// 회원가입 폼 데이터
export interface SignUpFormData {
	userType: UserType | null;
	profileImageUri: string | null;
	name: string;
	phone: string;
	bankName: string;
	accountNumber: string;
	isAlarmEnabled: boolean;
}

// 회원가입 초기 데이터
export const initialSignUpFormData: SignUpFormData = {
	userType: null,
	profileImageUri: null,
	name: "",
	phone: "",
	bankName: "",
	accountNumber: "",
	isAlarmEnabled: false,
};
