import { create } from "zustand";
import type { UserType } from "../types/signup.types";

interface SignUpState {
	// 카카오 액세스 토큰 (persist 안 함)
	kakaoAccessToken: string | null;

	// 회원가입 폼 데이터
	userType: UserType | null;
	profileImageUri: string | null;
	name: string;
	phone: string;
	bankName: string;
	accountNumber: string;
	isAlarmEnabled: boolean;

	// 액션
	setKakaoAccessToken: (token: string) => void;
	setUserType: (type: UserType) => void;
	setProfileImageUri: (uri: string | null) => void;
	setName: (name: string) => void;
	setPhone: (phone: string) => void;
	setBankName: (bankName: string) => void;
	setAccountNumber: (accountNumber: string) => void;
	setIsAlarmEnabled: (enabled: boolean) => void;

	// 전체 초기화 (회원가입 완료/취소 시)
	reset: () => void;
}

const initialState = {
	kakaoAccessToken: null,
	userType: null,
	profileImageUri: null,
	name: "",
	phone: "--",
	bankName: "",
	accountNumber: "",
	isAlarmEnabled: false,
};

export const useSignUpStore = create<SignUpState>((set) => ({
	...initialState,

	setKakaoAccessToken: (token) => set({ kakaoAccessToken: token }),
	setUserType: (type) => set({ userType: type }),
	setProfileImageUri: (uri) => set({ profileImageUri: uri }),
	setName: (name) => set({ name }),
	setPhone: (phone) => set({ phone }),
	setBankName: (bankName) => set({ bankName }),
	setAccountNumber: (accountNumber) => set({ accountNumber }),
	setIsAlarmEnabled: (enabled) => set({ isAlarmEnabled: enabled }),

	reset: () => set(initialState),
}));

// 스토어 외부에서 상태 접근용
export const getSignUpState = () => useSignUpStore.getState();
