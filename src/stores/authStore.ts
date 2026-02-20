import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserInfo } from "../api/auth/types";

interface AuthState {
	// 상태
	accessToken: string | null;
	userInfo: UserInfo | null;
	isLoggedIn: boolean;
	isHydrated: boolean;

	// 액션
	setAccessToken: (token: string) => void;
	setUserInfo: (info: UserInfo) => void;
	login: (token: string, userInfo: UserInfo) => void;
	logout: () => void;
	setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			// 초기 상태
			accessToken: null,
			userInfo: null,
			isLoggedIn: false,
			isHydrated: false,

			// 액션
			setAccessToken: (token) =>
				set({ accessToken: token, isLoggedIn: true }),

			setUserInfo: (info) => set({ userInfo: info }),

			login: (token, userInfo) =>
				set({
					accessToken: token,
					userInfo,
					isLoggedIn: true,
				}),

			logout: () =>
				set({
					accessToken: null,
					userInfo: null,
					isLoggedIn: false,
				}),

			setHydrated: (hydrated) => set({ isHydrated: hydrated }),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			// isHydrated는 persist하지 않음
			partialize: (state) => ({
				accessToken: state.accessToken,
				userInfo: state.userInfo,
				isLoggedIn: state.isLoggedIn,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true);
			},
		}
	)
);

// 스토어 외부에서 상태 접근용 (axios 인터셉터 등)
export const getAuthState = () => useAuthStore.getState();
