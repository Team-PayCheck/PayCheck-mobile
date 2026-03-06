/**
 * 푸시 알림 탭 → 딥링크 네비게이션 훅.
 * 백그라운드/종료 상태에서 알림을 탭하면 actionType에 따라 해당 화면으로 이동한다.
 */
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useAuthStore } from "../../stores/authStore";
import type { ActionType } from "../../api/notification/types";

type NavigationRef = {
	navigate: (screen: string, params?: Record<string, unknown>) => void;
};

/**
 * actionType → 화면 이름 매핑
 */
function getScreenName(
	actionType: ActionType | string,
	userType: string | undefined
): string {
	const isEmployer = userType === "EMPLOYER";

	switch (actionType) {
		case "VIEW_WORK_RECORD":
			return isEmployer ? "EmployerHomeMain" : "WorkerHomeMain";
		case "VIEW_CORRECTION_REQUEST":
			return isEmployer ? "EmployerReceivedRequests" : "SentRequests";
		case "VIEW_PENDING_APPROVAL":
			return isEmployer ? "EmployerReceivedRequests" : "Notifications";
		case "VIEW_SALARY":
			return isEmployer ? "Notifications" : "WorkerMonthlyCalendar";
		case "VIEW_PAYMENT_MANAGEMENT":
			return isEmployer ? "RemittanceManage" : "Notifications";
		case "VIEW_WORKPLACE_INVITATION":
			return isEmployer ? "WorkerManage" : "WorkplaceManage";
		case "VIEW_NOTICE":
		case "NONE":
		default:
			return "Notifications";
	}
}

export function useNotificationNavigation(navigationRef: NavigationRef | null) {
	const userType = useAuthStore((s) => s.userInfo?.userType);
	const lastResponseRef = useRef<string | null>(null);

	useEffect(() => {
		if (!navigationRef) return;

		// 앱이 종료 상태에서 알림 탭으로 열린 경우
		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!response) return;
			const id = response.notification.request.identifier;
			if (lastResponseRef.current === id) return;
			lastResponseRef.current = id;

			const data = response.notification.request.content.data;
			const actionType = (data?.actionType as ActionType) || "NONE";
			const screen = getScreenName(actionType, userType);
			navigationRef.navigate(screen);
		});

		// 앱이 백그라운드 상태에서 알림 탭한 경우
		const subscription =
			Notifications.addNotificationResponseReceivedListener((response) => {
				const data = response.notification.request.content.data;
				const actionType = (data?.actionType as ActionType) || "NONE";
				const screen = getScreenName(actionType, userType);
				navigationRef.navigate(screen);
			});

		return () => subscription.remove();
	}, [navigationRef, userType]);
}
