import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
	// 상태
	isOnboardingCompleted: boolean;
	isHydrated: boolean;

	// 액션
	completeOnboarding: () => void;
	resetOnboarding: () => void;
	setHydrated: (hydrated: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set) => ({
			// 초기 상태
			isOnboardingCompleted: false,
			isHydrated: false,

			// 액션
			completeOnboarding: () => set({ isOnboardingCompleted: true }),

			resetOnboarding: () => set({ isOnboardingCompleted: false }),

			setHydrated: (hydrated) => set({ isHydrated: hydrated }),
		}),
		{
			name: "onboarding-storage",
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				isOnboardingCompleted: state.isOnboardingCompleted,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true);
			},
		}
	)
);

// 스토어 외부에서 상태 접근용
export const getOnboardingState = () => useOnboardingStore.getState();
