import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useOnboardingStore } from "../../stores/onboardingStore";
import api from "../../api/axios";

type InitialRoute = "Onboarding" | "Welcome" | "EmployerHome" | "WorkerWeeklyCalendar";

export const useOnboardingStatus = () => {
	const [initialRoute, setInitialRoute] = useState<InitialRoute>("Onboarding");
	const [isLoading, setIsLoading] = useState(true);

	// Zustand 스토어에서 hydration 상태 및 데이터 가져오기
	const authHydrated = useAuthStore((state) => state.isHydrated);
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
	const userInfo = useAuthStore((state) => state.userInfo);
	const authLogout = useAuthStore((state) => state.logout);

	const onboardingHydrated = useOnboardingStore((state) => state.isHydrated);
	const isOnboardingCompleted = useOnboardingStore(
		(state) => state.isOnboardingCompleted
	);
	const completeOnboarding = useOnboardingStore(
		(state) => state.completeOnboarding
	);

	/**
	 * 토큰 유효성 검증
	 * - /api/users/me 호출로 토큰 검증
	 * - 401 발생 시 axios 인터셉터가 자동으로 refresh token으로 갱신 시도
	 * - 갱신 성공하면 true, 실패하면 false 반환
	 */
	const validateToken = useCallback(async (): Promise<boolean> => {
		try {
			await api.get("/api/users/me");
			return true;
		} catch {
			// 토큰 갱신도 실패한 경우 (axios 인터셉터에서 처리 후 여기로 옴)
			authLogout();
			return false;
		}
	}, [authLogout]);

	useEffect(() => {
		const determineInitialRoute = async () => {
			// 두 스토어 모두 hydration 완료될 때까지 대기
			if (!authHydrated || !onboardingHydrated) {
				return;
			}

			// 우선순위 1: 로그인된 상태면 토큰 검증 후 userType에 맞는 홈으로
			if (isLoggedIn) {
				const isValid = await validateToken();
				if (isValid) {
					const targetRoute = userInfo?.userType === "EMPLOYER" ? "EmployerHome" : "WorkerWeeklyCalendar";
					setInitialRoute("WorkerWeeklyCalendar");
				} else {
					// 토큰 만료 + 갱신 실패 → Welcome으로
					setInitialRoute("Welcome");
				}
			}
			// 우선순위 2: 온보딩 완료했으면 Welcome
			else if (isOnboardingCompleted) {
				setInitialRoute("Welcome");
			}
			// 그 외: Onboarding (기본값)

			setIsLoading(false);
		};

		determineInitialRoute();
	}, [authHydrated, onboardingHydrated, isLoggedIn, isOnboardingCompleted, userInfo, validateToken]);

	const handleOnboardingComplete = (navigation: { navigate: (route: string) => void }) => {
		completeOnboarding();
		navigation.navigate("Welcome");
	};

	return { initialRoute, isLoading, handleOnboardingComplete };
};
