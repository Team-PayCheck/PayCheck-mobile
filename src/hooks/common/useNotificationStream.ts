/**
 * SSE 실시간 알림 구독 훅.
 * 로그인 상태일 때 /api/notifications/stream에 연결하고,
 * 새 알림 수신 시 notificationStore의 unreadCount를 증가시킨다.
 * 로그아웃 또는 언마운트 시 자동 해제.
 */
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import Constants from "expo-constants";
import { useAuthStore } from "../../stores/authStore";
import { useNotificationStore } from "../../stores/notificationStore";
import { getNotifications } from "../../api/notification";
import { ReactNativeEventSource } from "../../utils/sse";

const env = Constants.expoConfig?.extra || {};
const API_BASE_URL = (env.backendApiUrl as string) || "http://localhost:8000";

export function useNotificationStream() {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
	const accessToken = useAuthStore((s) => s.accessToken);
	const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
	const incrementUnreadCount = useNotificationStore(
		(s) => s.incrementUnreadCount
	);
	const signalNewNotification = useNotificationStore(
		(s) => s.signalNewNotification
	);
	const sseRef = useRef<ReactNativeEventSource | null>(null);

	useEffect(() => {
		if (!isLoggedIn || !accessToken) {
			sseRef.current?.close();
			sseRef.current = null;
			return;
		}

		const refreshUnreadCount = () => {
			// size:1 — 개수만 필요하므로 페이로드 최소화
			getNotifications({ size: 1 })
				.then((res) => {
					if (res.success && res.data && res.data.unreadCount !== undefined) {
						setUnreadCount(res.data.unreadCount);
					}
				})
				.catch(() => {});
		};

		// 초기 읽지 않은 알림 수 조회
		refreshUnreadCount();

		// SSE 연결
		sseRef.current = new ReactNativeEventSource(
			`${API_BASE_URL}/api/notifications/stream`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				onMessage: (data: string) => {
					// JSON 파싱 성공 + id 필드가 있을 때만 실제 알림으로 간주
					try {
						const parsed = JSON.parse(data);
						if (parsed && typeof parsed.id === "number") {
							incrementUnreadCount();
							signalNewNotification();
						}
					} catch {
						// heartbeat 또는 비JSON 메시지 → 무시
					}
				},
			}
		);

		// 앱이 포그라운드로 복귀할 때 unreadCount 재조회 (SSE 끊김 대비 안전장치)
		const handleAppStateChange = (nextState: AppStateStatus) => {
			if (nextState === "active") {
				refreshUnreadCount();
			}
		};
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange
		);

		return () => {
			sseRef.current?.close();
			sseRef.current = null;
			subscription.remove();
		};
	}, [isLoggedIn, accessToken, setUnreadCount, incrementUnreadCount, signalNewNotification]);
}
