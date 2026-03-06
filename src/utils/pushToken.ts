import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { registerFcmToken, deleteFcmToken } from "../api/notification";
import { PUSH_TOKEN_KEY } from "../constants/storageKeys";

/**
 * 푸시 알림 권한 요청 + Expo Push Token 취득
 */
export async function getExpoPushToken(): Promise<string | null> {
	if (!Device.isDevice) {
		console.warn("푸시 알림은 실제 디바이스에서만 동작합니다.");
		return null;
	}

	const { status: existingStatus } =
		await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		console.warn("푸시 알림 권한이 거부되었습니다.");
		return null;
	}

	const projectId =
		Constants.expoConfig?.extra?.eas?.projectId ??
		Constants.easConfig?.projectId;

	if (!projectId) {
		console.warn("EAS projectId를 찾을 수 없습니다.");
		return null;
	}

	const { data: token } = await Notifications.getExpoPushTokenAsync({
		projectId,
	});

	return token;
}

/**
 * FCM 토큰을 백엔드에 등록하고 로컬에 저장
 * @returns 등록 성공 여부
 */
export async function registerPushToken(): Promise<boolean> {
	try {
		const token = await getExpoPushToken();
		if (!token) return false;

		const deviceInfo = `${Platform.OS} ${Platform.Version}`;
		await registerFcmToken({ token, deviceInfo });
		await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
		return true;
	} catch {
		return false;
	}
}

/**
 * 저장된 FCM 토큰을 백엔드에서 삭제하고 로컬에서도 제거
 */
export async function unregisterPushToken(): Promise<void> {
	try {
		const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
		if (!token) return;

		await deleteFcmToken({ token });
		await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
	} catch {
		// 삭제 실패해도 로그아웃 진행에는 지장 없음
		await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
	}
}
