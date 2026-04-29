/**
 * FCM 푸시 토큰 자동 등록 훅.
 * OS 알림 권한이 이미 granted이고 서버 설정의 pushEnabled가 true인 경우에만 토큰을 등록한다.
 * 사용자가 회원가입 Step4에서 "나중에 설정하기"를 선택한 경우 OS 권한이 미승인 상태이므로
 * 이 훅이 토큰을 자동 등록하지 않는다.
 */
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "../../stores/authStore";
import { registerPushToken } from "../../utils/pushToken";
import { getNotificationSettings } from "../../api/settings";

export function useFcmToken() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

	useEffect(() => {
		if (!isLoggedIn) return;

		(async () => {
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== "granted") return;

			const res = await getNotificationSettings();
			// 서버 설정 조회 실패 시 기본값으로 허용 처리 (OS 권한이 이미 있는 경우에만 도달)
			const pushEnabled = res.success && res.data ? res.data.pushEnabled : true;
			if (pushEnabled) {
				registerPushToken();
			}
		})();
	}, [isLoggedIn]);
}
