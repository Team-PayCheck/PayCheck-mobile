import { create } from "zustand";
import type { UserType } from "../api/user/types";

export type SignUpMode = "register" | "purge-and-register";

interface SignUpState {
	// 카카오 액세스 토큰 (persist 안 함)
	kakaoAccessToken: string | null;

	// 회원가입 모드 (탈퇴 계정 재가입 분기 식별용)
	mode: SignUpMode;

	// 회원가입 폼 데이터
	userType: UserType | null;
	name: string;
	phone: string;
	bankName: string;
	accountNumber: string;

	// 액션
	setKakaoAccessToken: (token: string) => void;
	setMode: (mode: SignUpMode) => void;
	setUserType: (type: UserType) => void;
	setName: (name: string) => void;
	setPhone: (phone: string) => void;
	setBankName: (bankName: string) => void;
	setAccountNumber: (accountNumber: string) => void;

	// 폼 필드만 초기화 (mode/kakaoAccessToken은 호출자가 설정한 값 보존 — 회원가입 진입 시 사용)
	resetForm: () => void;

	// 전체 초기화 (회원가입 완료/취소 시)
	reset: () => void;
}

const initialState = {
	kakaoAccessToken: null,
	mode: "register" as SignUpMode,
	userType: null,
	name: "",
	phone: "--",
	bankName: "",
	accountNumber: "",
};

export const useSignUpStore = create<SignUpState>((set) => ({
	...initialState,

	setKakaoAccessToken: (token) => set({ kakaoAccessToken: token }),
	setMode: (mode) => set({ mode }),
	setUserType: (type) => set({ userType: type }),
	setName: (name) => set({ name }),
	setPhone: (phone) => set({ phone }),
	setBankName: (bankName) => set({ bankName }),
	setAccountNumber: (accountNumber) => set({ accountNumber }),

	resetForm: () =>
		set({
			userType: initialState.userType,
			name: initialState.name,
			phone: initialState.phone,
			bankName: initialState.bankName,
			accountNumber: initialState.accountNumber,
		}),

	reset: () => set(initialState),
}));
