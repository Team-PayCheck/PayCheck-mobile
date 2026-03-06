/**
 * FCM 푸시 토큰 자동 등록 훅.
 * 로그인 상태이고 사용자가 푸시 알림을 허용한 경우에만 토큰을 등록한다.
 */
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../../stores/authStore";
import { registerPushToken } from "../../utils/pushToken";
import { PUSH_ENABLED_KEY } from "../../constants/storageKeys";

export function useFcmToken() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	useEffect(() => {
		if (!isLoggedIn) return;

		AsyncStorage.getItem(PUSH_ENABLED_KEY).then((value) => {
			// 기본값은 허용 (null이면 아직 설정한 적 없음 → 허용)
			if (value !== "false") {
				registerPushToken();
			}
		});
	}, [isLoggedIn]);
}
