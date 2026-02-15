import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";

export type NotificationPermissionStatus = "granted" | "denied" | "undetermined";

/**
 * Android 알림 채널 설정
 * Android 8.0+ 에서는 알림 채널이 필수
 */
const setupAndroidNotificationChannel = async (): Promise<void> => {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "기본 알림",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#769fcd",
		});
	}
};

/**
 * 알림 권한 상태 확인
 * 앱 어디서든 권한 상태를 확인할 때 사용
 */
export const getNotificationPermissionStatus =
	async (): Promise<NotificationPermissionStatus> => {
		const { status } = await Notifications.getPermissionsAsync();
		return status;
	};

/**
 * 권한 거부 시 설정 이동 Alert
 */
const showPermissionDeniedAlert = (): void => {
	Alert.alert(
		"알림 권한 필요",
		"알림을 받으려면 설정에서 알림 권한을 허용해주세요.",
		[
			{ text: "나중에", style: "cancel" },
			{ text: "설정", onPress: () => Linking.openSettings() },
		]
	);
};

/**
 * 푸시 알림 권한 요청 (회원가입 Step4용)
 *
 * @returns 권한 허용 여부 (true: 허용, false: 거부/취소)
 *
 * 플로우:
 * 1. 물리 디바이스 확인 (시뮬레이터는 푸시 알림 미지원)
 * 2. Android 채널 설정
 * 3. 현재 권한 상태 확인
 * 4. 미결정 상태면 권한 요청
 * 5. 거부 상태면 설정 이동 Alert 표시
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
	// 1. 물리 디바이스 확인 (시뮬레이터는 true 반환)
	if (!Device.isDevice) {
		// 시뮬레이터에서는 푸시 알림이 작동하지 않지만, 개발 편의를 위해 true 반환
		return true;
	}

	// 2. Android 채널 설정 (Android 8.0+ 필수)
	await setupAndroidNotificationChannel();

	// 3. 현재 권한 상태 확인
	const { status: existingStatus } = await Notifications.getPermissionsAsync();

	// 4. 이미 허용됨
	if (existingStatus === "granted") {
		return true;
	}

	// 5. 미결정 상태 → 권한 요청 (iOS: 시스템 다이얼로그 표시)
	if (existingStatus === "undetermined") {
		const { status } = await Notifications.requestPermissionsAsync();
		return status === "granted";
	}

	// 6. 거부됨 → 설정 이동 Alert
	showPermissionDeniedAlert();
	return false;
};
