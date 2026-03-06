/**
 * FCM 푸시 토큰 자동 등록 훅.
 * 로그인 상태가 되면 푸시 토큰을 발급받아 백엔드에 등록한다.
 */
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { registerPushToken } from "../../utils/pushToken";

export function useFcmToken() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	useEffect(() => {
		if (isLoggedIn) {
			registerPushToken();
		}
	}, [isLoggedIn]);
}
