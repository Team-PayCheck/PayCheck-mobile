/**
 * 공지사항 상세 보기 바텀시트.
 * 근무지명, 카테고리, 작성자, 제목, 본문, 만료일시를 표시한다.
 * 작성자 본인인 경우에만 수정/삭제 버튼을 노출한다.
 */
import React from "react";
import { View, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import BottomSheetModal from "../BottomSheetModal";
import { Text } from "../Text";
import { colors } from "../../../constants/colors";
import { NOTICE_CATEGORY_LABEL } from "../../../types/common/notice.types";
import { useAuthStore } from "../../../stores/authStore";
import type { NoticeDetailResponse } from "../../../api/notice/types";

/** "2026-03-02T09:00:00" → "3/2 09:00" */
const formatDateTime = (iso: string): string => {
	const d = new Date(iso);
	return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

interface NoticeDetailSheetProps {
	visible: boolean;
	onClose: () => void;
	notice: NoticeDetailResponse | null;
	isLoading: boolean;
	onPressEdit: () => void;
	onPressDelete: (noticeId: number) => void;
}

const NoticeDetailSheet: React.FC<NoticeDetailSheetProps> = ({
	visible,
	onClose,
	notice,
	isLoading,
	onPressEdit,
	onPressDelete,
}) => {
	const { userInfo } = useAuthStore();
	const isAuthor = notice?.authorId === userInfo?.userId;

	const handleDelete = () => {
		if (!notice) return;
		Alert.alert("삭제", "삭제하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "삭제",
				style: "destructive",
				onPress: () => onPressDelete(notice.id),
			},
		]);
	};

	return (
		<BottomSheetModal visible={visible} onClose={onClose}>
			{isLoading || !notice ? (
				<View style={styles.loader}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : (
				<View style={styles.content}>
					{/* 헤더: 근무지명 + 카테고리 */}
					<View style={styles.headerRow}>
						<Text weight="Bold" style={styles.workplaceName}>
							{notice.workplaceName}
						</Text>
						<View style={styles.categoryBadge}>
							<Text weight="Medium" style={styles.categoryText}>
								{NOTICE_CATEGORY_LABEL[notice.category]}
							</Text>
						</View>
					</View>

					{/* 작성자 정보 */}
					<View style={styles.authorRow}>
						<Image
							source={require("../../../assets/images/mypage/basicProfileImage.png")}
							style={styles.profileImage}
						/>
						<View style={styles.authorInfo}>
							<Text weight="SemiBold" style={styles.authorName}>
								{notice.authorName}
							</Text>
							<Text style={styles.authorTime}>
								{formatDateTime(notice.createdAt)}
							</Text>
						</View>
					</View>

					{/* 제목 */}
					<Text weight="Bold" style={styles.title}>
						{notice.title}
					</Text>

					{/* 본문 */}
					<Text style={styles.body}>{notice.content}</Text>

					{/* 만료일시 */}
					<View style={styles.expiresRow}>
						<Text style={styles.expiresLabel}>
							종료일시 : {formatDateTime(notice.expiresAt)}
						</Text>
					</View>

					{/* 수정/삭제 버튼 (작성자만) */}
					{isAuthor && (
						<View style={styles.footer}>
							<TouchableOpacity onPress={onPressEdit} activeOpacity={0.7}>
								<Text weight="SemiBold" style={styles.editText}>
									수정
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
								<Text weight="SemiBold" style={styles.deleteText}>
									삭제
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			)}
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	loader: {
		paddingVertical: 60,
		alignItems: "center",
	},
	content: {
		gap: 16,
		paddingBottom: 8,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	workplaceName: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	categoryBadge: {
		backgroundColor: colors.primaryLight,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 10,
	},
	categoryText: {
		fontSize: 12,
		color: colors.primary,
	},
	authorRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	profileImage: {
		width: 36,
		height: 36,
		borderRadius: 18,
	},
	authorInfo: {
		gap: 2,
	},
	authorName: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	authorTime: {
		fontSize: 12,
		color: colors.textMuted,
	},
	title: {
		fontSize: 18,
		color: colors.textPrimary,
		marginTop: 4,
	},
	body: {
		fontSize: 14,
		color: colors.textSecondary,
		lineHeight: 22,
	},
	expiresRow: {
		alignItems: "flex-end",
	},
	expiresLabel: {
		fontSize: 12,
		color: colors.textMuted,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
	},
	editText: {
		fontSize: 15,
		color: colors.primary,
	},
	deleteText: {
		fontSize: 15,
		color: colors.red,
	},
});

export default NoticeDetailSheet;
