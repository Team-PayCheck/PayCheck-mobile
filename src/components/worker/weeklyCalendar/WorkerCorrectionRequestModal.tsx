import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import PrimaryButton from "../../common/PrimaryButton";
import WheelPicker from "../../common/WheelPicker";
import type { WheelPickerItem } from "../../common/WheelPicker";
import { colors } from "../../../constants/colors";
import type { WorkItem } from "../../../types/worker.types";

interface WorkerCorrectionRequestModalProps {
	visible: boolean;
	onClose: () => void;
	work: WorkItem | null;
	onSubmit: (data: {
		workRecordId: number;
		requestedWorkDate: string;
		requestedStartTime: string;
		requestedEndTime: string;
		requestedBreakMinutes: number;
	}) => void;
}

type PickerTarget =
	| "startDate"
	| "startHour"
	| "startMinute"
	| "endDate"
	| "endHour"
	| "endMinute"
	| "breakMinutes"
	| null;

const HOUR_ITEMS: WheelPickerItem[] = Array.from({ length: 24 }, (_, i) => ({
	label: String(i).padStart(2, "0"),
	value: i,
}));

const MINUTE_ITEMS: WheelPickerItem[] = Array.from({ length: 60 }, (_, i) => ({
	label: String(i).padStart(2, "0"),
	value: i,
}));

const BREAK_ITEMS: WheelPickerItem[] = Array.from({ length: 7 }, (_, i) => ({
	label: `${i * 10}`,
	value: i * 10,
}));

const getDateItems = (): WheelPickerItem[] => {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	return Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1;
		return {
			label: `${month + 1}/${day}`,
			value: day,
		};
	});
};

const parseWorkItem = (work: WorkItem) => {
	const workDate = new Date(work.workDate);
	const date = workDate.getDate();
	const month = workDate.getMonth() + 1;
	const [startH, startM] = work.startTime.split(":").map(Number);
	const [endH, endM] = work.endTime.split(":").map(Number);

	return {
		date,
		month,
		startHour: startH,
		startMinute: startM,
		endHour: endH,
		endMinute: endM,
		breakMinutes: work.breakMinutes,
	};
};

const WorkerCorrectionRequestModal: React.FC<
	WorkerCorrectionRequestModalProps
> = ({ visible, onClose, work, onSubmit }) => {
	const [correctedStartDate, setCorrectedStartDate] = useState(1);
	const [correctedStartHour, setCorrectedStartHour] = useState(0);
	const [correctedStartMinute, setCorrectedStartMinute] = useState(0);
	const [correctedEndDate, setCorrectedEndDate] = useState(1);
	const [correctedEndHour, setCorrectedEndHour] = useState(0);
	const [correctedEndMinute, setCorrectedEndMinute] = useState(0);
	const [correctedBreakMinutes, setCorrectedBreakMinutes] = useState(0);
	const [activePicker, setActivePicker] = useState<PickerTarget>(null);

	const dateItems = useMemo(() => getDateItems(), []);

	const original = useMemo(
		() => (work ? parseWorkItem(work) : null),
		[work]
	);

	// 모달 열릴 때 정정 값을 기존 값으로 초기화
	useEffect(() => {
		if (visible && original) {
			setCorrectedStartDate(original.date);
			setCorrectedStartHour(original.startHour);
			setCorrectedStartMinute(original.startMinute);
			setCorrectedEndDate(original.date);
			setCorrectedEndHour(original.endHour);
			setCorrectedEndMinute(original.endMinute);
			setCorrectedBreakMinutes(original.breakMinutes);
			setActivePicker(null);
		}
	}, [visible, original]);

	// 변경 사항 감지
	const hasChanges = useMemo(() => {
		if (!original) return false;
		return (
			correctedStartDate !== original.date ||
			correctedStartHour !== original.startHour ||
			correctedStartMinute !== original.startMinute ||
			correctedEndDate !== original.date ||
			correctedEndHour !== original.endHour ||
			correctedEndMinute !== original.endMinute ||
			correctedBreakMinutes !== original.breakMinutes
		);
	}, [
		original,
		correctedStartDate,
		correctedStartHour,
		correctedStartMinute,
		correctedEndDate,
		correctedEndHour,
		correctedEndMinute,
		correctedBreakMinutes,
	]);

	const handleSubmit = () => {
		if (!work || !hasChanges) return;

		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(correctedStartDate).padStart(2, "0")}`;

		onSubmit({
			workRecordId: work.id,
			requestedWorkDate: dateStr,
			requestedStartTime: `${String(correctedStartHour).padStart(2, "0")}:${String(correctedStartMinute).padStart(2, "0")}`,
			requestedEndTime: `${String(correctedEndHour).padStart(2, "0")}:${String(correctedEndMinute).padStart(2, "0")}`,
			requestedBreakMinutes: correctedBreakMinutes,
		});
	};

	const handlePickerChange = (value: string | number) => {
		switch (activePicker) {
			case "startDate":
				setCorrectedStartDate(value as number);
				break;
			case "startHour":
				setCorrectedStartHour(value as number);
				break;
			case "startMinute":
				setCorrectedStartMinute(value as number);
				break;
			case "endDate":
				setCorrectedEndDate(value as number);
				break;
			case "endHour":
				setCorrectedEndHour(value as number);
				break;
			case "endMinute":
				setCorrectedEndMinute(value as number);
				break;
			case "breakMinutes":
				setCorrectedBreakMinutes(value as number);
				break;
		}
	};

	const getPickerConfig = (): {
		items: WheelPickerItem[];
		selectedValue: string | number;
		width: number;
	} => {
		switch (activePicker) {
			case "startDate":
			case "endDate":
				return {
					items: dateItems,
					selectedValue:
						activePicker === "startDate"
							? correctedStartDate
							: correctedEndDate,
					width: 120,
				};
			case "startHour":
			case "endHour":
				return {
					items: HOUR_ITEMS,
					selectedValue:
						activePicker === "startHour"
							? correctedStartHour
							: correctedEndHour,
					width: 80,
				};
			case "startMinute":
			case "endMinute":
				return {
					items: MINUTE_ITEMS,
					selectedValue:
						activePicker === "startMinute"
							? correctedStartMinute
							: correctedEndMinute,
					width: 80,
				};
			case "breakMinutes":
				return {
					items: BREAK_ITEMS,
					selectedValue: correctedBreakMinutes,
					width: 80,
				};
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	};

	if (!work || !original) return null;

	const pickerConfig = getPickerConfig();
	const currentMonth = new Date().getMonth() + 1;

	const renderReadonlyField = (value: string) => (
		<View style={styles.readonlyField}>
			<Text weight="Medium" style={styles.readonlyText}>
				{value}
			</Text>
		</View>
	);

	const renderSelectField = (target: PickerTarget, displayValue: string) => (
		<View
			style={[
				styles.selectField,
				activePicker === target && styles.selectFieldActive,
			]}
			onTouchEnd={() =>
				setActivePicker(activePicker === target ? null : target)
			}
		>
			<Text weight="Medium" style={styles.selectText}>
				{displayValue}
			</Text>
			<Feather name="chevron-down" size={14} color={colors.textMuted} />
		</View>
	);

	return (
		<BottomSheetModal visible={visible} onClose={onClose}>
			<ScrollView showsVerticalScrollIndicator={false} bounces={false}>
				<Text weight="Bold" style={styles.title}>
					근무 기록 정정 요청
				</Text>

				{/* 기존 근무시간 */}
				<Text weight="Bold" style={styles.sectionTitle}>
					기존 근무시간
				</Text>
				<View style={styles.timeSection}>
					<View style={styles.timeColumn}>
						<Text weight="Medium" style={styles.label}>
							근무 시간
						</Text>
						<View style={styles.timeRow}>
							{renderReadonlyField(
								`${original.month}/${original.date}`
							)}
							{renderReadonlyField(
								String(original.startHour).padStart(2, "0")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderReadonlyField(
								String(original.startMinute).padStart(2, "0")
							)}
						</View>
						<Text weight="Medium" style={styles.tilde}>
							~
						</Text>
						<View style={styles.timeRow}>
							{renderReadonlyField(
								`${original.month}/${original.date}`
							)}
							{renderReadonlyField(
								String(original.endHour).padStart(2, "0")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderReadonlyField(
								String(original.endMinute).padStart(2, "0")
							)}
						</View>
					</View>
					<View style={styles.breakColumn}>
						<Text weight="Medium" style={styles.label}>
							휴게 시간
						</Text>
						<View style={styles.breakRow}>
							{renderReadonlyField(
								String(original.breakMinutes)
							)}
							<Text weight="Medium" style={styles.unitText}>
								분
							</Text>
						</View>
					</View>
				</View>

				{/* 점선 구분선 */}
				<View style={styles.dashedLine} />

				{/* 정정한 근무시간 */}
				<Text weight="Bold" style={styles.sectionTitle}>
					정정한 근무시간
				</Text>
				<View style={styles.timeSection}>
					<View style={styles.timeColumn}>
						<Text weight="Medium" style={styles.label}>
							근무 시간
						</Text>
						<View style={styles.timeRow}>
							{renderSelectField(
								"startDate",
								`${currentMonth}/${correctedStartDate}`
							)}
							{renderSelectField(
								"startHour",
								String(correctedStartHour).padStart(2, "0")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField(
								"startMinute",
								String(correctedStartMinute).padStart(2, "0")
							)}
						</View>
						<Text weight="Medium" style={styles.tilde}>
							~
						</Text>
						<View style={styles.timeRow}>
							{renderSelectField(
								"endDate",
								`${currentMonth}/${correctedEndDate}`
							)}
							{renderSelectField(
								"endHour",
								String(correctedEndHour).padStart(2, "0")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField(
								"endMinute",
								String(correctedEndMinute).padStart(2, "0")
							)}
						</View>
					</View>
					<View style={styles.breakColumn}>
						<Text weight="Medium" style={styles.label}>
							휴게 시간
						</Text>
						<View style={styles.breakRow}>
							{renderSelectField(
								"breakMinutes",
								String(correctedBreakMinutes)
							)}
							<Text weight="Medium" style={styles.unitText}>
								분
							</Text>
						</View>
					</View>
				</View>

				{/* WheelPicker 영역 */}
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

				{/* 요청 보내기 버튼 */}
				<View style={styles.submitRow}>
					<PrimaryButton
						text="요청 보내기"
						onPress={handleSubmit}
						disabled={!hasChanges}
						icon={
							<Feather
								name="send"
								size={16}
								color={colors.white}
							/>
						}
						size="compact"
					/>
				</View>
			</ScrollView>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		color: colors.textPrimary,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		color: colors.textPrimary,
		marginBottom: 16,
	},
	timeSection: {
		flexDirection: "row",
		gap: 16,
	},
	timeColumn: {
		flex: 1,
		gap: 4,
	},
	breakColumn: {
		gap: 4,
	},
	label: {
		fontSize: 13,
		color: colors.textSecondary,
		marginBottom: 4,
	},
	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	timeSeparator: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	tilde: {
		fontSize: 16,
		color: colors.textSecondary,
		textAlign: "center",
		marginVertical: 4,
	},
	breakRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	unitText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	readonlyField: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		minWidth: 48,
		alignItems: "center",
	},
	readonlyText: {
		fontSize: 14,
		color: colors.textMuted,
	},
	selectField: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		minWidth: 48,
		gap: 4,
	},
	selectFieldActive: {
		borderColor: colors.primary,
	},
	selectText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	dashedLine: {
		borderStyle: "dashed",
		borderWidth: 1,
		borderColor: colors.border,
		marginVertical: 24,
	},
	pickerArea: {
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
		paddingTop: 12,
		marginBottom: 12,
	},
	pickerWrapper: {
		alignItems: "center",
	},
	submitRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 16,
		marginBottom: 8,
	},
});

export default WorkerCorrectionRequestModal;
