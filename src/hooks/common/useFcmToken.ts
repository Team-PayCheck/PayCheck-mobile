/**
 * FCM 푸시 토큰 자동 등록 훅.
 * 로그인 상태이고 서버 알림 설정에서 pushEnabled가 true인 경우에만 토큰을 등록한다.
 */
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { registerPushToken } from "../../utils/pushToken";
import { getNotificationSettings } from "../../api/settings";

export function useFcmToken() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	useEffect(() => {
		if (!isLoggedIn) return;

		getNotificationSettings().then((res) => {
			// 서버 설정 조회 실패 시 기본값으로 허용 처리
			const pushEnabled = res.success && res.data ? res.data.pushEnabled : true;
			if (pushEnabled) {
				registerPushToken();
			}
		});
	}, [isLoggedIn]);
}
