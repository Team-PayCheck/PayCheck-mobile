/**
 * 공지사항 목록 보드. 가로 스크롤로 NoticeCard를 나열한다.
 */
import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import NoticeCard from "./NoticeCard";
import { colors } from "../../constants/colors";
import type { NoticeCardItem } from "../../types/common/notice.types";

interface NoticeBoardProps {
	notices: NoticeCardItem[];
	onPressAdd?: () => void;
	onPressNotice?: (notice: NoticeCardItem) => void;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({
	notices,
	onPressAdd,
	onPressNotice,
}) => {
	return (
		<View style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<Text weight="Bold" style={styles.headerTitle}>
					공지 게시판
				</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={onPressAdd}
					activeOpacity={0.7}
				>
					<Text weight="SemiBold" style={styles.addButtonText}>
						+ 추가
					</Text>
				</TouchableOpacity>
			</View>

			{/* 카드 가로 스크롤 */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.cardList}
			>
				{notices.map((notice) => (
					<NoticeCard
						key={notice.id}
						notice={notice}
						onPress={onPressNotice}
					/>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerTitle: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	addButton: {
		backgroundColor: colors.blue,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 14,
	},
	addButtonText: {
		fontSize: 12,
		color: colors.white,
	},
	cardList: {
		gap: 10,
	},
});

export default NoticeBoard;
