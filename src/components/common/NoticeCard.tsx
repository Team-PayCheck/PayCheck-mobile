import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "../../constants/colors";
import type { NoticeItem } from "../../types/worker.types";

interface NoticeCardProps {
	notice: NoticeItem;
	onPress?: (notice: NoticeItem) => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
	return (
		<TouchableOpacity
			style={styles.card}
			onPress={() => onPress?.(notice)}
			activeOpacity={0.7}
		>
			<View style={styles.iconContainer}>
				{notice.icon ? (
					<Image source={notice.icon} style={styles.icon} resizeMode="contain" />
				) : (
					<Ionicons
						name="document-text-outline"
						size={24}
						color={colors.primary}
					/>
				)}
			</View>
			<Text weight="SemiBold" style={styles.category}>
				{notice.category}
			</Text>
      <Text weight="ExtraBold" style={styles.title} numberOfLines={2}>
				{notice.title}
			</Text>
			<View style={styles.footer}>
				<Text style={styles.author}>{notice.author}</Text>
				<Text style={styles.time}>{notice.time}</Text>
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
