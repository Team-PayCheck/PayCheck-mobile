import React from "react";
import {
	View,
	FlatList,
	Pressable,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text } from "../../components/common/Text";
import Pagination from "../../components/common/Pagination";
import { getNotificationIconConfig } from "../../components/common/notification/NotificationPopup";
import { useNotifications } from "../../hooks/common/useNotifications";
import { formatRelativeTime } from "../../utils/date";
import { colors } from "../../constants/colors";
import type { NotificationResponse } from "../../api/notification/types";

const READ_COLOR = "#AAAAAA";
const READ_BG = "#F5F5F5";

const NotificationItem: React.FC<{
	notification: NotificationResponse;
	onPress: () => void;
	onDelete: () => void;
}> = ({ notification, onPress, onDelete }) => {
	const iconConfig = getNotificationIconConfig(notification.type);
	const iconColor = notification.isRead ? READ_COLOR : iconConfig.color;
	const iconBg = notification.isRead ? READ_BG : iconConfig.bgColor;

	return (
		<Pressable
			style={[
				styles.item,
				!notification.isRead && styles.itemUnread,
			]}
			onPress={onPress}
		>
			<View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
				<Ionicons name={iconConfig.name} size={20} color={iconColor} />
			</View>
			<View style={styles.itemContent}>
				<Text
					weight={notification.isRead ? "Regular" : "Medium"}
					style={[
						styles.itemMessage,
						notification.isRead && styles.itemMessageRead,
					]}
					numberOfLines={2}
				>
					{notification.message}
				</Text>
				<Text style={styles.itemTime}>
					{formatRelativeTime(notification.createdAt)}
				</Text>
			</View>
			<Pressable
				style={styles.deleteButton}
				onPress={onDelete}
				hitSlop={8}
			>
				<Ionicons name="close" size={16} color={colors.textMuted} />
			</Pressable>
		</Pressable>
	);
};

type FilterType = "all" | "unread";

const NotificationScreen = () => {
	const navigation = useNavigation();
	const {
		notifications,
		unreadCount,
		isLoading,
		currentPage,
		totalPages,
		setCurrentPage,
		isReadFilter,
		setIsReadFilter,
		fetchNotifications,
		fetchUnreadCount,
		handleRead,
		handleReadAll,
		handleDelete,
	} = useNotifications();

	const filter: FilterType = isReadFilter === false ? "unread" : "all";

	const handleFilterChange = (type: FilterType) => {
		setCurrentPage(0);
		setIsReadFilter(type === "unread" ? false : undefined);
	};

	const handleRefresh = async () => {
		await Promise.all([fetchNotifications(), fetchUnreadCount()]);
	};

	const handlePressItem = async (notification: NotificationResponse) => {
		if (!notification.isRead) {
			await handleRead(notification.id);
		}
	};

	const safeNotifications = notifications ?? [];

	const renderItem = ({
		item,
	}: {
		item: NotificationResponse;
	}) => (
		<NotificationItem
			notification={item}
			onPress={() => handlePressItem(item)}
			onDelete={() => handleDelete(item.id)}
		/>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable
					onPress={() => navigation.goBack()}
					hitSlop={8}
				>
					<Ionicons
						name="chevron-back"
						size={28}
						color={colors.textPrimary}
					/>
				</Pressable>
				<Text weight="SemiBold" style={styles.headerTitle}>
					알림
				</Text>
				<Pressable onPress={handleReadAll} hitSlop={8}>
					<Text weight="Medium" style={styles.readAllText}>
						전체 읽음
					</Text>
				</Pressable>
			</View>

			<View style={styles.filterContainer}>
				<TouchableOpacity
					style={[
						styles.filterChip,
						filter === "all" && styles.filterChipSelected,
					]}
					onPress={() => handleFilterChange("all")}
					activeOpacity={0.7}
				>
					<Text
						weight={filter === "all" ? "SemiBold" : "Regular"}
						style={[
							styles.filterChipText,
							filter === "all" && styles.filterChipTextSelected,
						]}
					>
						전체
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.filterChip,
						filter === "unread" && styles.filterChipSelected,
					]}
					onPress={() => handleFilterChange("unread")}
					activeOpacity={0.7}
				>
					<Text
						weight={filter === "unread" ? "SemiBold" : "Regular"}
						style={[
							styles.filterChipText,
							filter === "unread" && styles.filterChipTextSelected,
						]}
					>
						읽지 않은 알림 {unreadCount}
					</Text>
				</TouchableOpacity>
			</View>

			{isLoading && safeNotifications.length === 0 ? (
				<ActivityIndicator
					size="large"
					color={colors.primary}
					style={styles.loader}
				/>
			) : (
				<FlatList
					data={safeNotifications}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					refreshControl={
						<RefreshControl
							refreshing={isLoading}
							onRefresh={handleRefresh}
							tintColor={colors.primary}
						/>
					}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Ionicons
								name="notifications-off-outline"
								size={48}
								color={colors.textMuted}
							/>
							<Text style={styles.emptyText}>
								{filter === "unread"
									? "읽지 않은 알림이 없습니다."
									: "알림이 없습니다."}
							</Text>
						</View>
					}
					contentContainerStyle={[
						styles.listContent,
						safeNotifications.length === 0 && styles.emptyList,
					]}
				/>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				alwaysShow
			/>
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
	readAllText: {
		fontSize: 14,
		color: colors.primary,
	},
	filterContainer: {
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	filterChip: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.white,
	},
	filterChipSelected: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	filterChipText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	filterChipTextSelected: {
		color: colors.white,
	},
	listContent: {
		paddingBottom: 8,
	},
	loader: {
		flex: 1,
		justifyContent: "center",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.borderLight,
	},
	itemUnread: {
		backgroundColor: "#F8FBFF",
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	itemContent: {
		flex: 1,
	},
	itemMessage: {
		fontSize: 14,
		color: colors.textPrimary,
		lineHeight: 20,
	},
	itemMessageRead: {
		color: colors.textSecondary,
	},
	itemTime: {
		fontSize: 12,
		color: colors.textMuted,
		marginTop: 2,
	},
	deleteButton: {
		padding: 4,
		marginLeft: 8,
	},
	emptyContainer: {
		alignItems: "center",
		gap: 12,
	},
	emptyText: {
		fontSize: 15,
		color: colors.textMuted,
	},
	emptyList: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default NotificationScreen;
