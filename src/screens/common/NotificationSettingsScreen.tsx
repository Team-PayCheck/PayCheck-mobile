import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	View,
	Switch,
	Alert,
	Pressable,
	StyleSheet,
	Linking,
	Platform,
	ActivityIndicator,
	AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Text } from "../../components/common/Text";
import { registerPushToken, unregisterPushToken } from "../../utils/pushToken";
import { getNotificationSettings, updateNotificationSettings } from "../../api/settings";
import { colors } from "../../constants/colors";

const NotificationSettingsScreen = () => {
	const navigation = useNavigation();
	const [pushEnabled, setPushEnabled] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const lastGrantedRef = useRef<boolean | null>(null);

	const openDeviceSettings = useCallback(() => {
		if (Platform.OS === "ios") {
			Linking.openURL("app-settings:");
		} else {
			Linking.openSettings();
		}
	}, []);

	// 디바이스 권한 상태를 단일 진실 공급원으로 사용한다.
	// 표시 상태를 OS 권한에 맞추고, 서버 설정과 다르면 토큰 등록/해제와 함께 동기화한다.
	const syncWithDevicePermission = useCallback(async () => {
		const { status } = await Notifications.getPermissionsAsync();
		const granted = status === "granted";
		setPushEnabled(granted);

		const isFirstSync = lastGrantedRef.current === null;
		const deviceChanged = !isFirstSync && lastGrantedRef.current !== granted;
		lastGrantedRef.current = granted;

		if (isFirstSync || deviceChanged) {
			const res = await getNotificationSettings();
			const serverEnabled = res.success && res.data ? res.data.pushEnabled : false;
			if (serverEnabled !== granted) {
				try {
					if (granted) {
						await registerPushToken();
					} else {
						await unregisterPushToken();
					}
					await updateNotificationSettings({ pushEnabled: granted });
				} catch {
					// 실패 시 다음 포그라운드 진입에서 재동기화되도록 직전 값을 롤백한다.
					lastGrantedRef.current = !granted;
				}
			}
		}

		setIsLoading(false);
	}, []);

	useEffect(() => {
		syncWithDevicePermission();
		const subscription = AppState.addEventListener("change", (state) => {
			if (state === "active") {
				syncWithDevicePermission();
			}
		});
		return () => subscription.remove();
	}, [syncWithDevicePermission]);

	const handleToggleAttempt = useCallback(() => {
		Alert.alert(
			"알림 설정 변경",
			"푸시 알림은 디바이스 설정에서만 변경할 수 있습니다.",
			[
				{ text: "취소", style: "cancel" },
				{ text: "설정으로 이동", onPress: openDeviceSettings },
			]
		);
	}, [openDeviceSettings]);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()} hitSlop={8}>
					<Ionicons
						name="chevron-back"
						size={28}
						color={colors.textPrimary}
					/>
				</Pressable>
				<Text weight="SemiBold" style={styles.headerTitle}>
					알림 설정
				</Text>
				<View style={{ width: 28 }} />
			</View>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator color={colors.primary} />
				</View>
			) : (
				<View style={styles.content}>
					<Pressable style={styles.settingRow} onPress={handleToggleAttempt}>
						<View style={styles.settingInfo}>
							<Text weight="SemiBold" style={styles.settingTitle}>
								푸시 알림
							</Text>
							<Text style={styles.settingDesc}>
								앱을 사용하지 않을 때도 알림을 받습니다.
							</Text>
						</View>
						<Switch
							value={pushEnabled}
							onValueChange={handleToggleAttempt}
							trackColor={{
								false: colors.disabled,
								true: colors.primary,
							}}
							thumbColor={colors.white}
						/>
					</Pressable>

					<Pressable style={styles.linkRow} onPress={openDeviceSettings}>
						<Text weight="Medium" style={styles.linkText}>
							디바이스 알림 설정 열기
						</Text>
						<Ionicons
							name="open-outline"
							size={18}
							color={colors.textSecondary}
						/>
					</Pressable>

					<Text style={styles.hintText}>
						푸시 알림 상태는 디바이스 설정과 항상 동기화됩니다.{"\n"}
						변경하려면 디바이스 설정에서 알림 권한을 조정해주세요.
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.border,
	},
	headerTitle: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 24,
	},
	settingRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.borderLight,
	},
	settingInfo: {
		flex: 1,
		marginRight: 16,
	},
	settingTitle: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	settingDesc: {
		fontSize: 13,
		color: colors.textSecondary,
		marginTop: 4,
	},
	linkRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 18,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.borderLight,
	},
	linkText: {
		fontSize: 15,
		color: colors.textSecondary,
	},
	hintText: {
		fontSize: 12,
		color: colors.textMuted,
		marginTop: 12,
		lineHeight: 18,
	},
});

export default NotificationSettingsScreen;
