import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useOnboardingStore } from "../../stores/onboardingStore";

type InitialRoute = "Onboarding" | "Welcome" | "Home";

export const useOnboardingStatus = () => {
	const [initialRoute, setInitialRoute] = useState<InitialRoute>("Onboarding");
	const [isLoading, setIsLoading] = useState(true);

	// Zustand 스토어에서 hydration 상태 및 데이터 가져오기
	const authHydrated = useAuthStore((state) => state.isHydrated);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	const onboardingHydrated = useOnboardingStore((state) => state.isHydrated);
	const isOnboardingCompleted = useOnboardingStore(
		(state) => state.isOnboardingCompleted
	);
	const completeOnboarding = useOnboardingStore(
		(state) => state.completeOnboarding
	);

	useEffect(() => {
		// 두 스토어 모두 hydration 완료될 때까지 대기
		if (!authHydrated || !onboardingHydrated) {
			return;
		}

		// 우선순위 1: 로그인된 상태면 Home
		if (isLoggedIn) {
			setInitialRoute("Home");
		}
		// 우선순위 2: 온보딩 완료했으면 Welcome
		else if (isOnboardingCompleted) {
			setInitialRoute("Welcome");
		}
		// 그 외: Onboarding (기본값)

		setIsLoading(false);
	}, [authHydrated, onboardingHydrated, isLoggedIn, isOnboardingCompleted]);

	const handleOnboardingComplete = (navigation: { navigate: (route: string) => void }) => {
		completeOnboarding();
		navigation.navigate("Welcome");
	};

	return { initialRoute, isLoading, handleOnboardingComplete };
};
