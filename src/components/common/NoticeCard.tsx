/**
 * 공지사항 개별 카드. 카테고리 아이콘, 카테고리명, 제목, 작성자, 시간을 표시한다.
 */
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "../../constants/colors";
import { NOTICE_CATEGORY_LABEL } from "../../types/common/notice.types";
import type { NoticeCardItem } from "../../types/common/notice.types";
import type { NoticeCategory } from "../../api/notice/types";

// 카테고리별 아이콘 이미지 매핑
const CATEGORY_ICON: Record<NoticeCategory, any> = {
	HANDOVER: require("../../assets/images/notice/handover.png"),
	URGENT: require("../../assets/images/notice/urgent.png"),
  SCHEDULE: require("../../assets/images/notice/schedule.png"),
	ETC: require("../../assets/images/notice/etc.png"),
};

/** createdAt ISO 문자열에서 "HH:MM" 추출 */
const formatTime = (createdAt: string): string => {
	const date = new Date(createdAt);
	const h = String(date.getHours()).padStart(2, "0");
	const m = String(date.getMinutes()).padStart(2, "0");
	return `${h}:${m}`;
};

interface NoticeCardProps {
	notice: NoticeCardItem;
	onPress?: (notice: NoticeCardItem) => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
	const iconSource = CATEGORY_ICON[notice.category];

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={() => onPress?.(notice)}
			activeOpacity={0.7}
		>
			<View style={styles.iconContainer}>
				{iconSource ? (
					<Image source={iconSource} style={styles.icon} resizeMode="contain" />
				) : (
					<Ionicons
						name="calendar-outline"
						size={28}
						color={colors.primary}
					/>
				)}
			</View>
			<Text weight="SemiBold" style={styles.category}>
				{NOTICE_CATEGORY_LABEL[notice.category]}
			</Text>
			<Text weight="ExtraBold" style={styles.title} numberOfLines={2}>
				{notice.title}
			</Text>
			<View style={styles.footer}>
				<Text style={styles.author}>{notice.authorName}</Text>
				<Text style={styles.time}>{formatTime(notice.createdAt)}</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		width: 160,
		backgroundColor: colors.white,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: colors.borderLight,
		padding: 16,
		gap: 8,
	},
	iconContainer: {
		width: 52,
		height: 52,
		borderRadius: 14,
		backgroundColor: colors.primaryLight,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		width: 40,
		height: 40,
	},
	category: {
		fontSize: 12,
		color: colors.primary,
	},
	title: {
		fontSize: 13,
		color: colors.textPrimary,
		lineHeight: 18,
		flex: 1,
	},
	footer: {
		marginTop: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	author: {
		fontSize: 12,
		color: colors.textMuted,
	},
	time: {
		fontSize: 12,
		color: colors.textMuted,
	},
});

export default NoticeCard;
