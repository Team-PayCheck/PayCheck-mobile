import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
	isOnboardingCompleted: boolean;
	isHydrated: boolean;
	completeOnboarding: () => void;
	setHydrated: (hydrated: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set) => ({
			isOnboardingCompleted: false,
			isHydrated: false,
			completeOnboarding: () => set({ isOnboardingCompleted: true }),
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
