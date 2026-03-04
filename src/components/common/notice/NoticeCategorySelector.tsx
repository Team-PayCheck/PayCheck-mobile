/**
 * 공지사항 카테고리 가로 스크롤 선택 컴포넌트.
 * 아이콘 + 텍스트 형태의 선택 버튼을 나열한다.
 */
import React from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../Text";
import { colors } from "../../../constants/colors";
import { NOTICE_CATEGORY_LABEL } from "../../../types/common/notice.types";
import type { NoticeCategory } from "../../../api/notice/types";

const CATEGORIES: NoticeCategory[] = ["HANDOVER", "SCHEDULE", "URGENT", "ETC"];

const CATEGORY_ICON: Record<NoticeCategory, any> = {
	HANDOVER: require("../../../assets/images/notice/handover.png"),
	URGENT: require("../../../assets/images/notice/urgent.png"),
  SCHEDULE: require("../../../assets/images/notice/schedule.png"),
	ETC: require("../../../assets/images/notice/etc.png"),
};

interface NoticeCategorySelectorProps {
	selected: NoticeCategory;
	onSelect: (category: NoticeCategory) => void;
}

const NoticeCategorySelector: React.FC<NoticeCategorySelectorProps> = ({
	selected,
	onSelect,
}) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.container}
		>
			{CATEGORIES.map((category) => {
				const isSelected = selected === category;
				const iconSource = CATEGORY_ICON[category];

				return (
					<TouchableOpacity
						key={category}
						style={[styles.item, isSelected && styles.itemSelected]}
						onPress={() => onSelect(category)}
						activeOpacity={0.7}
					>
						<View style={[styles.iconBox, isSelected && styles.iconBoxSelected]}>
							{iconSource ? (
								<Image source={iconSource} style={styles.icon} resizeMode="contain" />
							) : (
								<Ionicons
									name="calendar-outline"
									size={24}
									color={isSelected ? colors.primary : colors.textMuted}
								/>
							)}
						</View>
						<Text
							weight={isSelected ? "Bold" : "Medium"}
							style={[styles.label, isSelected && styles.labelSelected]}
						>
							{NOTICE_CATEGORY_LABEL[category]}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	item: {
		alignItems: "center",
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 12,
		borderWidth: 1.5,
		borderColor: colors.borderLight,
		backgroundColor: colors.white,
	},
	itemSelected: {
		borderColor: colors.primary,
		backgroundColor: colors.primaryLight,
	},
	iconBox: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: colors.backgroundGrey,
		alignItems: "center",
		justifyContent: "center",
	},
	iconBoxSelected: {
		backgroundColor: colors.white,
	},
	icon: {
		width: 32,
		height: 32,
	},
	label: {
		fontSize: 12,
		color: colors.textSecondary,
	},
	labelSelected: {
		color: colors.primary,
	},
});

export default NoticeCategorySelector;
