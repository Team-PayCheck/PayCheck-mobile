/**
 * 공지사항 작성 바텀시트.
 * 카테고리, 제목, 내용, 만료일시를 입력받아 공지를 생성한다.
 */
import React, { useState, useCallback } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomSheetModal from "../BottomSheetModal";
import WheelPicker from "../WheelPicker";
import PrimaryButton from "../PrimaryButton";
import { Text } from "../Text";
import NoticeCategorySelector from "./NoticeCategorySelector";
import { colors } from "../../../constants/colors";
import { usePickerState } from "../../../hooks/common/usePickerState";
import type { NoticeCategory, CreateNoticeRequest } from "../../../api/notice/types";

const CONTENT_MAX_LENGTH = 200;

interface NoticeCreateModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: CreateNoticeRequest) => Promise<boolean>;
}

const NoticeCreateModal: React.FC<NoticeCreateModalProps> = ({
	visible,
	onClose,
	onSubmit,
}) => {
	const [category, setCategory] = useState<NoticeCategory>("HANDOVER");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const picker = usePickerState({ includeToday: false });

	const resetForm = useCallback(() => {
		setCategory("HANDOVER");
		setTitle("");
		setContent("");
		setIsSubmitting(false);
		picker.resetPicker();
	}, [picker]);

	const handleClose = useCallback(() => {
		resetForm();
		onClose();
	}, [onClose, resetForm]);

	const canSubmit =
		title.trim().length > 0 && content.trim().length > 0 && !isSubmitting;

	const handleSubmit = useCallback(async () => {
		if (!canSubmit) return;
		setIsSubmitting(true);

		const success = await onSubmit({
			category,
			title: title.trim(),
			content: content.trim(),
			expiresAt: picker.buildExpiresAt(),
		});

		setIsSubmitting(false);
		if (success) handleClose();
	}, [canSubmit, category, title, content, picker, onSubmit, handleClose]);

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

	return (
		<BottomSheetModal visible={visible} onClose={handleClose}>
			{/* 스크롤 가능한 폼 영역 */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
				style={styles.scroll}
			>
				{/* 타이틀 */}
				<Text weight="ExtraBold" style={styles.sheetTitle}>
					공지 게시판 글쓰기
				</Text>

				{/* 카테고리 */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						카테고리 지정하기
					</Text>
					<NoticeCategorySelector
						selected={category}
						onSelect={setCategory}
					/>
				</View>

				{/* 내용 작성 (제목 + 내용) */}
				<View style={styles.section}>
					<Text weight="SemiBold" style={styles.sectionLabel}>
						내용 작성
					</Text>
					<TextInput
						style={styles.titleInput}
						placeholder="제목을 입력하시오.."
						placeholderTextColor={colors.textMuted}
						value={title}
						onChangeText={setTitle}
						maxLength={100}
						onFocus={picker.closePicker}
					/>
					<TextInput
						style={styles.contentInput}
						placeholder="내용을 입력하세요 (최대 200자)"
						placeholderTextColor={colors.textMuted}
						value={content}
						onChangeText={setContent}
						maxLength={CONTENT_MAX_LENGTH}
						multiline
						textAlignVertical="top"
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
				<TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
					<Text weight="SemiBold" style={styles.deleteText}>
						삭제
					</Text>
				</TouchableOpacity>
				<PrimaryButton
					text="+ 추가하기"
					onPress={handleSubmit}
					disabled={!canSubmit}
					size="compact"
				/>
			</View>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	scroll: {
		maxHeight: 420,
	},
	sheetTitle: {
		fontSize: 20,
		color: colors.textPrimary,
		marginBottom: 16,
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
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
	},
	deleteText: {
		fontSize: 15,
		color: colors.red,
	},
});

export default NoticeCreateModal;
