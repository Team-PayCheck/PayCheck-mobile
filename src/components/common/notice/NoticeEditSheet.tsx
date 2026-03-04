/**
 * 공지사항 수정 바텀시트.
 * 기존 공지 데이터를 폼에 채워 수정할 수 있다.
 * 수정/삭제 시 Alert 확인 다이얼로그를 표시한다.
 */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
	View,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomSheetModal from "../BottomSheetModal";
import WheelPicker from "../WheelPicker";
import { Text } from "../Text";
import NoticeCategorySelector from "./NoticeCategorySelector";
import { colors } from "../../../constants/colors";
import { NOTICE_CATEGORY_LABEL } from "../../../types/common/notice.types";
import { usePickerState } from "../../../hooks/common/usePickerState";
import { extractDate, extractHour, extractMinute } from "../../../utils/notice";
import type {
	NoticeCategory,
	NoticeDetailResponse,
	UpdateNoticeRequest,
} from "../../../api/notice/types";

const CONTENT_MAX_LENGTH = 200;

interface NoticeEditSheetProps {
	visible: boolean;
	onClose: () => void;
	notice: NoticeDetailResponse | null;
	onSubmit: (noticeId: number, data: UpdateNoticeRequest) => Promise<boolean>;
	onDelete: (noticeId: number) => Promise<boolean>;
}

const NoticeEditSheet: React.FC<NoticeEditSheetProps> = ({
	visible,
	onClose,
	notice,
	onSubmit,
	onDelete,
}) => {
	const [category, setCategory] = useState<NoticeCategory>("HANDOVER");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const picker = usePickerState({ includeToday: true });

	// notice가 변경되면 폼 초기화
	useEffect(() => {
		if (notice && visible) {
			setCategory(notice.category);
			setTitle(notice.title);
			setContent(notice.content);
			picker.resetPicker(
				extractDate(notice.expiresAt),
				extractHour(notice.expiresAt),
				extractMinute(notice.expiresAt)
			);
			setIsSubmitting(false);
		}
	}, [notice, visible]);

	const hasChanges = useMemo(() => {
		if (!notice) return false;
		return (
			category !== notice.category ||
			title.trim() !== notice.title ||
			content.trim() !== notice.content ||
			picker.expiresDate !== extractDate(notice.expiresAt) ||
			picker.expiresHour !== extractHour(notice.expiresAt) ||
			picker.expiresMinute !== extractMinute(notice.expiresAt)
		);
	}, [notice, category, title, content, picker.expiresDate, picker.expiresHour, picker.expiresMinute]);

	const canSubmit =
		title.trim().length > 0 && content.trim().length > 0 && hasChanges && !isSubmitting;

	const handleSubmit = useCallback(() => {
		if (!notice || !canSubmit) return;

		Alert.alert("수정", "수정하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "수정",
				onPress: async () => {
					setIsSubmitting(true);
					const success = await onSubmit(notice.id, {
						category,
						title: title.trim(),
						content: content.trim(),
						expiresAt: picker.buildExpiresAt(),
					});

					setIsSubmitting(false);
					if (success) onClose();
				},
			},
		]);
	}, [notice, canSubmit, category, title, content, picker, onSubmit, onClose]);

	const handleDelete = useCallback(() => {
		if (!notice) return;

		Alert.alert("삭제", "삭제하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "삭제",
				style: "destructive",
				onPress: async () => {
					const success = await onDelete(notice.id);
					if (success) onClose();
				},
			},
		]);
	}, [notice, onDelete, onClose]);

	const renderSelectField = (
		target: "date" | "hour" | "minute",
		displayValue: string,
		style?: object
	) => (
		<TouchableOpacity
			style={[
				styles.selectField,
				picker.activePicker === target && styles.selectFieldActive,
				style,
			]}
			onPress={() => picker.togglePicker(target)}
			activeOpacity={0.7}
		>
			<Text weight="Medium" style={styles.selectText}>
				{displayValue}
			</Text>
			<Feather name="chevron-down" size={14} color={colors.textMuted} />
		</TouchableOpacity>
	);

	if (!notice) return null;

	return (
		<BottomSheetModal visible={visible} onClose={onClose}>
			{/* 스크롤 가능한 폼 영역 */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				style={styles.scroll}
			>
				{/* 헤더: 근무지명 + 카테고리 */}
				<View style={styles.headerRow}>
					<Text weight="SemiBold" style={styles.workplaceName}>
						{notice.workplaceName}
					</Text>
					<View style={styles.categoryBadge}>
						<Text weight="Medium" style={styles.categoryBadgeText}>
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
					<Text weight="SemiBold" style={styles.authorName}>
						{notice.authorName}
					</Text>
				</View>

				{/* 카테고리 변경 */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						카테고리
					</Text>
					<NoticeCategorySelector selected={category} onSelect={setCategory} />
				</View>

				{/* 제목 */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						제목
					</Text>
					<TextInput
						style={styles.titleInput}
						value={title}
						onChangeText={setTitle}
						maxLength={100}
						placeholder="제목을 입력하시오.."
						placeholderTextColor={colors.textMuted}
						onFocus={picker.closePicker}
					/>
				</View>

				{/* 내용 */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						내용
					</Text>
					<TextInput
						style={styles.contentInput}
						value={content}
						onChangeText={setContent}
						maxLength={CONTENT_MAX_LENGTH}
						multiline
						textAlignVertical="top"
						placeholder="내용을 입력하세요 (최대 200자)"
						placeholderTextColor={colors.textMuted}
						onFocus={picker.closePicker}
					/>
					<Text style={styles.charCount}>
						{content.length}/{CONTENT_MAX_LENGTH}
					</Text>
				</View>

				{/* 일정 종료일시 */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						일정 종료일시
					</Text>
					<View style={styles.timeRow}>
						{renderSelectField("date", picker.displayDate, { minWidth: 80 })}
						{renderSelectField(
							"hour",
							`${String(picker.expiresHour).padStart(2, "0")}시`,
							{ minWidth: 64 }
						)}
						{renderSelectField(
							"minute",
							`${String(picker.expiresMinute).padStart(2, "0")}분`,
							{ minWidth: 64 }
						)}
					</View>
				</View>
			</ScrollView>

			{/* WheelPicker 영역 (ScrollView 바깥) */}
			{picker.activePicker && picker.pickerConfig.items.length > 0 && (
				<View style={styles.pickerArea}>
					<View style={styles.pickerWrapper}>
						<WheelPicker
							items={picker.pickerConfig.items}
							selectedValue={picker.pickerConfig.selectedValue}
							onValueChange={picker.handlePickerChange}
							width={picker.pickerConfig.width}
						/>
					</View>
				</View>
			)}

			{/* 하단 버튼 */}
			<View style={styles.footer}>
				<TouchableOpacity onPress={handleSubmit} activeOpacity={0.7} disabled={!canSubmit}>
					<Text
						weight="SemiBold"
						style={[styles.editText, !canSubmit && styles.disabledText]}
					>
						수정
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleDelete} activeOpacity={0.7}>
					<Text weight="SemiBold" style={styles.deleteText}>
						삭제
					</Text>
				</TouchableOpacity>
			</View>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	scroll: {
		maxHeight: 420,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 12,
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
	categoryBadgeText: {
		fontSize: 12,
		color: colors.primary,
	},
	authorRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 16,
	},
	profileImage: {
		width: 32,
		height: 32,
		borderRadius: 16,
	},
	authorName: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	section: {
		gap: 8,
		marginBottom: 16,
	},
	sectionLabel: {
		fontSize: 13,
		color: colors.textPrimary,
	},
	titleInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 10,
		fontSize: 14,
		color: colors.textPrimary,
		backgroundColor: colors.white,
		fontFamily: "Pretendard-Medium",
	},
	contentInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 10,
		fontSize: 14,
		color: colors.textPrimary,
		backgroundColor: colors.white,
		fontFamily: "Pretendard-Medium",
		minHeight: 80,
	},
	charCount: {
		fontSize: 12,
		color: colors.textMuted,
		textAlign: "right",
	},
	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	selectField: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		gap: 6,
	},
	selectFieldActive: {
		borderColor: colors.primary,
	},
	selectText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	pickerArea: {
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
		paddingVertical: 12,
	},
	pickerWrapper: {
		alignItems: "center",
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
	disabledText: {
		color: colors.textDisabled,
	},
});

export default NoticeEditSheet;
