import { create } from "zustand";
import type { UserType } from "../api/user/types";

interface SignUpState {
	// 카카오 액세스 토큰 (persist 안 함)
	kakaoAccessToken: string | null;

	// 회원가입 폼 데이터
	userType: UserType | null;
	name: string;
	phone: string;
	bankName: string;
	accountNumber: string;

	// 액션
	setKakaoAccessToken: (token: string) => void;
	setUserType: (type: UserType) => void;
	setName: (name: string) => void;
	setPhone: (phone: string) => void;
	setBankName: (bankName: string) => void;
	setAccountNumber: (accountNumber: string) => void;

	// 전체 초기화 (회원가입 완료/취소 시)
	reset: () => void;
}

const initialState = {
	kakaoAccessToken: null,
	userType: null,
	name: "",
	phone: "--",
	bankName: "",
	accountNumber: "",
};

export const useSignUpStore = create<SignUpState>((set) => ({
	...initialState,

	setKakaoAccessToken: (token) => set({ kakaoAccessToken: token }),
	setUserType: (type) => set({ userType: type }),
	setName: (name) => set({ name }),
	setPhone: (phone) => set({ phone }),
	setBankName: (bankName) => set({ bankName }),
	setAccountNumber: (accountNumber) => set({ accountNumber }),

	reset: () => set(initialState),
}));
