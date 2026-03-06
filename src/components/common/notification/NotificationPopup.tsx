import React from "react";
import {
	View,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../Text";
import { colors } from "../../../constants/colors";
import { formatRelativeTime } from "../../../utils/date";
import type {
	NotificationResponse,
	NotificationType,
} from "../../../api/notification/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const POPUP_WIDTH = SCREEN_WIDTH - 40;
const HEADER_HEIGHT = 52;

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface NotificationIconConfig {
	name: IoniconsName;
	color: string;
	bgColor: string;
}

export const getNotificationIconConfig = (
	type: NotificationType
): NotificationIconConfig => {
	switch (type) {
		case "PAYMENT_SUCCESS":
		case "WORK_RECORD_CONFIRMATION":
			return {
				name: "card-outline",
				color: "#0158CC",
				bgColor: "#E8F1FC",
			};
		case "NOTICE_CREATED":
			return {
				name: "megaphone-outline",
				color: "#7C3AED",
				bgColor: "#F3E8FF",
			};
		case "SCHEDULE_CREATED":
		case "SCHEDULE_CHANGE":
		case "SCHEDULE_DELETED":
			return {
				name: "calendar-outline",
				color: "#28C28D",
				bgColor: "#E0F2F1",
			};
		case "UNREAD_CORRECTION_REQUEST":
		case "CORRECTION_RESPONSE":
			return {
				name: "document-text-outline",
				color: "#F59E0B",
				bgColor: "#FEF3C7",
			};
		case "INVITATION":
			return {
				name: "person-add-outline",
				color: "#0158CC",
				bgColor: "#E8F1FC",
			};
		case "RESIGNATION":
			return {
				name: "exit-outline",
				color: "#F17D77",
				bgColor: "#FEE2E2",
			};
		default:
			return {
				name: "notifications-outline",
				color: "#777777",
				bgColor: "#F5F5F5",
			};
	}
};

const READ_COLOR = "#AAAAAA";
const READ_BG = "#F5F5F5";

interface NotificationPopupProps {
	visible: boolean;
	onClose: () => void;
	notifications: NotificationResponse[];
	onPressItem: (notification: NotificationResponse) => void;
	onPressViewAll: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
	visible,
	onClose,
	notifications,
	onPressItem,
	onPressViewAll,
}) => {
	const insets = useSafeAreaInsets();
	const topOffset = insets.top + HEADER_HEIGHT;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable
					style={[styles.popup, { top: topOffset, right: 16 }]}
					onPress={(e) => e.stopPropagation()}
				>
					<Text weight="SemiBold" style={styles.title}>
						알림
					</Text>

					<ScrollView
						style={styles.list}
						showsVerticalScrollIndicator={false}
					>
						{(!notifications || notifications.length === 0) ? (
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>
									알림이 없습니다.
								</Text>
							</View>
						) : (
							notifications.slice(0, 5).map((notification) => {
								const iconConfig = getNotificationIconConfig(
									notification.type
								);
								const iconColor = notification.isRead
									? READ_COLOR
									: iconConfig.color;
								const iconBg = notification.isRead
									? READ_BG
									: iconConfig.bgColor;

								return (
									<Pressable
										key={notification.id}
										style={styles.item}
										onPress={() =>
											onPressItem(notification)
										}
									>
										<View
											style={[
												styles.iconCircle,
												{ backgroundColor: iconBg },
											]}
										>
											<Ionicons
												name={iconConfig.name}
												size={18}
												color={iconColor}
											/>
										</View>
										<View style={styles.itemContent}>
											<Text
												weight={
													notification.isRead
														? "Regular"
														: "Medium"
												}
												style={[
													styles.itemMessage,
													notification.isRead &&
														styles.itemMessageRead,
												]}
												numberOfLines={2}
											>
												{notification.message || notification.title}
											</Text>
											<Text style={styles.itemTime}>
												{formatRelativeTime(
													notification.createdAt
												)}
											</Text>
										</View>
									</Pressable>
								);
							})
						)}
					</ScrollView>

					<Pressable
						style={styles.viewAllButton}
						onPress={onPressViewAll}
					>
						<Text weight="Medium" style={styles.viewAllText}>
							전체 보기
						</Text>
					</Pressable>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	popup: {
		position: "absolute",
		width: POPUP_WIDTH,
		maxHeight: 420,
		backgroundColor: colors.white,
		borderRadius: 16,
		paddingVertical: 16,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	title: {
		fontSize: 16,
		color: colors.textPrimary,
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	list: {
		maxHeight: 320,
	},
	emptyContainer: {
		paddingVertical: 32,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 14,
		color: colors.textMuted,
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.borderLight,
	},
	iconCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	itemContent: {
		flex: 1,
	},
	itemMessage: {
		fontSize: 13,
		color: colors.textPrimary,
		lineHeight: 18,
	},
	itemMessageRead: {
		color: colors.textSecondary,
	},
	itemTime: {
		fontSize: 11,
		color: colors.textMuted,
		marginTop: 2,
	},
	viewAllButton: {
		alignItems: "center",
		paddingVertical: 12,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: colors.border,
		marginTop: 4,
	},
	viewAllText: {
		fontSize: 13,
		color: colors.primary,
	},
});

export default NotificationPopup;
