/**
 * 공지사항 작성 전체 화면 모달.
 * 카테고리, 제목, 내용, 만료일시를 입력받아 공지를 생성한다.
 */
import React, { useState, useCallback, useMemo } from "react";
import {
	Modal,
	View,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Text } from "../Text";
import WheelPicker from "../WheelPicker";
import PrimaryButton from "../PrimaryButton";
import NoticeCategorySelector from "./NoticeCategorySelector";
import { colors } from "../../../constants/colors";
import { HOUR_ITEMS, MINUTE_ITEMS } from "../../../constants/pickerItems";
import type { NoticeCategory, CreateNoticeRequest } from "../../../api/notice/types";
import type { WheelPickerItem } from "../WheelPicker";

const CONTENT_MAX_LENGTH = 200;

type PickerTarget = "date" | "hour" | "minute" | null;

/** 오늘부터 60일간의 날짜 아이템 생성 */
const getExpiresDateItems = (): WheelPickerItem[] => {
	const items: WheelPickerItem[] = [];
	const today = new Date();
	for (let i = 1; i <= 60; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		items.push({
			label: `${d.getMonth() + 1}/${d.getDate()}`,
			value: `${yyyy}-${mm}-${dd}`,
		});
	}
	return items;
};

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
	const [expiresDate, setExpiresDate] = useState("");
	const [expiresHour, setExpiresHour] = useState(18);
	const [expiresMinute, setExpiresMinute] = useState(0);
	const [activePicker, setActivePicker] = useState<PickerTarget>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dateItems = useMemo(() => getExpiresDateItems(), []);

	// 초기 날짜 설정 (내일)
	const defaultDate = dateItems[0]?.value as string;

	const resetForm = useCallback(() => {
		setCategory("HANDOVER");
		setTitle("");
		setContent("");
		setExpiresDate("");
		setExpiresHour(18);
		setExpiresMinute(0);
		setActivePicker(null);
		setIsSubmitting(false);
	}, []);

	const handleClose = useCallback(() => {
		resetForm();
		onClose();
	}, [onClose, resetForm]);

	const togglePicker = useCallback(
		(target: PickerTarget) => {
			setActivePicker(activePicker === target ? null : target);
		},
		[activePicker]
	);

	const handlePickerChange = useCallback(
		(value: string | number) => {
			switch (activePicker) {
				case "date":
					setExpiresDate(value as string);
					break;
				case "hour":
					setExpiresHour(value as number);
					break;
				case "minute":
					setExpiresMinute(value as number);
					break;
			}
		},
		[activePicker]
	);

	const pickerConfig = useMemo(() => {
		switch (activePicker) {
			case "date":
				return {
					items: dateItems,
					selectedValue: expiresDate || defaultDate,
					width: 120,
				};
			case "hour":
				return { items: HOUR_ITEMS, selectedValue: expiresHour, width: 80 };
			case "minute":
				return { items: MINUTE_ITEMS, selectedValue: expiresMinute, width: 80 };
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	}, [activePicker, dateItems, expiresDate, defaultDate, expiresHour, expiresMinute]);

	const displayDate = useMemo(() => {
		const dateVal = expiresDate || defaultDate;
		const item = dateItems.find((d) => d.value === dateVal);
		return item?.label ?? "";
	}, [expiresDate, defaultDate, dateItems]);

	const canSubmit =
		title.trim().length > 0 && content.trim().length > 0 && !isSubmitting;

	const handleSubmit = useCallback(async () => {
		if (!canSubmit) return;
		setIsSubmitting(true);

		const dateVal = expiresDate || defaultDate;
		const hh = String(expiresHour).padStart(2, "0");
		const mm = String(expiresMinute).padStart(2, "0");

		const success = await onSubmit({
			category,
			title: title.trim(),
			content: content.trim(),
			expiresAt: `${dateVal}T${hh}:${mm}:00`,
		});

		setIsSubmitting(false);
		if (success) handleClose();
	}, [
		canSubmit,
		category,
		title,
		content,
		expiresDate,
		defaultDate,
		expiresHour,
		expiresMinute,
		onSubmit,
		handleClose,
	]);

	const renderSelectField = (
		target: PickerTarget,
		displayValue: string,
		style?: object
	) => (
		<TouchableOpacity
			style={[
				styles.selectField,
				activePicker === target && styles.selectFieldActive,
				style,
			]}
			onPress={() => togglePicker(target)}
			activeOpacity={0.7}
		>
			<Text weight="Medium" style={styles.selectText}>
				{displayValue}
			</Text>
			<Feather name="chevron-down" size={14} color={colors.textMuted} />
		</TouchableOpacity>
	);

	return (
		<Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
			<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
				<KeyboardAvoidingView
					style={styles.flex}
					behavior={Platform.OS === "ios" ? "padding" : undefined}
				>
					{/* 헤더 */}
					<View style={styles.header}>
						<TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
							<Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
						</TouchableOpacity>
						<Text weight="Bold" style={styles.headerTitle}>
							공지 작성
						</Text>
						<View style={{ width: 24 }} />
					</View>

					{/* 본문 */}
					<ScrollView
						style={styles.flex}
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						{/* 카테고리 */}
						<View style={styles.section}>
							<Text weight="SemiBold" style={styles.sectionLabel}>
								카테고리
							</Text>
							<NoticeCategorySelector
								selected={category}
								onSelect={setCategory}
							/>
						</View>

						{/* 제목 */}
						<View style={styles.section}>
							<Text weight="SemiBold" style={styles.sectionLabel}>
								제목
							</Text>
							<TextInput
								style={styles.titleInput}
								placeholder="제목을 입력하시오.."
								placeholderTextColor={colors.textMuted}
								value={title}
								onChangeText={setTitle}
								maxLength={100}
								onFocus={() => setActivePicker(null)}
							/>
						</View>

						{/* 내용 */}
						<View style={styles.section}>
							<Text weight="SemiBold" style={styles.sectionLabel}>
								내용
							</Text>
							<TextInput
								style={styles.contentInput}
								placeholder="내용을 입력하세요 (최대 200자)"
								placeholderTextColor={colors.textMuted}
								value={content}
								onChangeText={setContent}
								maxLength={CONTENT_MAX_LENGTH}
								multiline
								textAlignVertical="top"
								onFocus={() => setActivePicker(null)}
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
								{renderSelectField("date", displayDate, { minWidth: 80 })}
								{renderSelectField(
									"hour",
									`${String(expiresHour).padStart(2, "0")}시`,
									{ minWidth: 64 }
								)}
								{renderSelectField(
									"minute",
									`${String(expiresMinute).padStart(2, "0")}분`,
									{ minWidth: 64 }
								)}
							</View>
						</View>
					</ScrollView>

					{/* WheelPicker 영역 (ScrollView 바깥) */}
					{activePicker && pickerConfig.items.length > 0 && (
						<View style={styles.pickerArea}>
							<View style={styles.pickerWrapper}>
								<WheelPicker
									items={pickerConfig.items}
									selectedValue={pickerConfig.selectedValue}
									onValueChange={handlePickerChange}
									width={pickerConfig.width}
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
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	flex: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	headerTitle: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 24,
		gap: 24,
	},
	section: {
		gap: 10,
	},
	sectionLabel: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	titleInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 15,
		color: colors.textPrimary,
		backgroundColor: colors.white,
		fontFamily: "Pretendard-Medium",
	},
	contentInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 15,
		color: colors.textPrimary,
		backgroundColor: colors.white,
		fontFamily: "Pretendard-Medium",
		minHeight: 120,
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
		backgroundColor: colors.background,
	},
	pickerWrapper: {
		alignItems: "center",
	},
	footer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
	},
	deleteText: {
		fontSize: 15,
		color: colors.red,
	},
});

export default NoticeCreateModal;
