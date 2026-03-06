import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Switch,
	Alert,
	Pressable,
	StyleSheet,
	Linking,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Text } from "../../components/common/Text";
import { registerPushToken, unregisterPushToken } from "../../utils/pushToken";
import { colors } from "../../constants/colors";

const PUSH_ENABLED_KEY = "push_notification_enabled";

const NotificationSettingsScreen = () => {
	const navigation = useNavigation();
	const [pushEnabled, setPushEnabled] = useState(true);
	const [isToggling, setIsToggling] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem(PUSH_ENABLED_KEY).then((value) => {
			if (value !== null) {
				setPushEnabled(value === "true");
			}
		});
	}, []);

	const handleToggle = useCallback(async (newValue: boolean) => {
		if (newValue) {
			// ON으로 바꿀 때: 디바이스 알림 권한 확인
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== "granted") {
				Alert.alert(
					"알림 권한 필요",
					"디바이스 설정에서 알림을 허용해주세요.",
					[
						{ text: "취소", style: "cancel" },
						{
							text: "설정으로 이동",
							onPress: () => {
								if (Platform.OS === "ios") {
									Linking.openURL("app-settings:");
								} else {
									Linking.openSettings();
								}
							},
						},
					]
				);
				return;
			}
		}

		setIsToggling(true);
		try {
			if (newValue) {
				await registerPushToken();
			} else {
				await unregisterPushToken();
			}
			setPushEnabled(newValue);
			await AsyncStorage.setItem(PUSH_ENABLED_KEY, String(newValue));
		} catch {
			// 실패 시 토글 원복하지 않음 (이미 등록/삭제 시도 완료)
		} finally {
			setIsToggling(false);
		}
	}, []);

	const openDeviceSettings = () => {
		if (Platform.OS === "ios") {
			Linking.openURL("app-settings:");
		} else {
			Linking.openSettings();
		}
	};

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

			<View style={styles.content}>
				<View style={styles.settingRow}>
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
						onValueChange={handleToggle}
						disabled={isToggling}
						trackColor={{
							false: colors.disabled,
							true: colors.primary,
						}}
						thumbColor={colors.white}
					/>
				</View>

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
					디바이스 설정에서 알림 권한을 끄면 푸시 알림이{"\n"}
					앱 내 설정과 관계없이 수신되지 않습니다.
				</Text>
			</View>
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
