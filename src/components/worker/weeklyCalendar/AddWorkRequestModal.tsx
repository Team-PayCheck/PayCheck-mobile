import React, { useState, useMemo } from "react";
import {
	View,
	Modal,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import WheelPicker from "../../common/WheelPicker";
import type { WheelPickerItem } from "../../common/WheelPicker";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";

export interface WorkplaceOption {
	id: number;
	name: string;
	salary: number;
}

interface AddWorkRequestModalProps {
	visible: boolean;
	onClose: () => void;
	workplaces: WorkplaceOption[];
	onSubmit: (data: {
		contractId: number;
		requestedWorkDate: string;
		requestedStartTime: string;
		requestedEndTime: string;
		requestedBreakMinutes: number;
	}) => void;
}

type PickerTarget =
	| "workplace"
	| "date"
	| "startHour"
	| "startMinute"
	| "endHour"
	| "endMinute"
	| "breakMinutes"
	| null;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 시간/분 옵션 생성
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

// 이번 달 날짜 옵션 생성
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

const AddWorkRequestModal: React.FC<AddWorkRequestModalProps> = ({
	visible,
	onClose,
	workplaces,
	onSubmit,
}) => {
	const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<
		number | null
	>(null);
	const [selectedDate, setSelectedDate] = useState<number>(
		new Date().getDate()
	);
	const [startHour, setStartHour] = useState(0);
	const [startMinute, setStartMinute] = useState(0);
	const [endHour, setEndHour] = useState(0);
	const [endMinute, setEndMinute] = useState(0);
	const [breakMinutes, setBreakMinutes] = useState(0);
	const [activePicker, setActivePicker] = useState<PickerTarget>(null);

	const dateItems = useMemo(() => getDateItems(), []);

	const workplaceItems: WheelPickerItem[] = useMemo(
		() =>
			workplaces.map((wp) => ({
				label: wp.name,
				value: wp.id,
			})),
		[workplaces]
	);

	const selectedWorkplace = workplaces.find(
		(wp) => wp.id === selectedWorkplaceId
	);
	const salary = selectedWorkplace?.salary ?? 0;

	const handleSubmit = () => {
		if (!selectedWorkplaceId) return;

		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

		onSubmit({
			contractId: selectedWorkplaceId,
			requestedWorkDate: dateStr,
			requestedStartTime: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
			requestedEndTime: `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
			requestedBreakMinutes: breakMinutes,
		});
	};

	const handlePickerChange = (value: string | number) => {
		switch (activePicker) {
			case "workplace":
				setSelectedWorkplaceId(value as number);
				break;
			case "date":
				setSelectedDate(value as number);
				break;
			case "startHour":
				setStartHour(value as number);
				break;
			case "startMinute":
				setStartMinute(value as number);
				break;
			case "endHour":
				setEndHour(value as number);
				break;
			case "endMinute":
				setEndMinute(value as number);
				break;
			case "breakMinutes":
				setBreakMinutes(value as number);
				break;
		}
	};

	const getPickerConfig = (): {
		items: WheelPickerItem[];
		selectedValue: string | number;
		width: number;
	} => {
		switch (activePicker) {
			case "workplace":
				return {
					items: workplaceItems,
					selectedValue: selectedWorkplaceId ?? workplaces[0]?.id ?? 0,
					width: SCREEN_WIDTH - 80,
				};
			case "date":
				return {
					items: dateItems,
					selectedValue: selectedDate,
					width: 120,
				};
			case "startHour":
			case "endHour":
				return {
					items: HOUR_ITEMS,
					selectedValue:
						activePicker === "startHour" ? startHour : endHour,
					width: 80,
				};
			case "startMinute":
			case "endMinute":
				return {
					items: MINUTE_ITEMS,
					selectedValue:
						activePicker === "startMinute"
							? startMinute
							: endMinute,
					width: 80,
				};
			case "breakMinutes":
				return {
					items: BREAK_ITEMS,
					selectedValue: breakMinutes,
					width: 80,
				};
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	};

	const renderSelectField = (
		_label: string,
		target: PickerTarget,
		style?: object
	) => {
		let displayValue = "";
		switch (target) {
			case "workplace":
				displayValue = selectedWorkplace?.name ?? "근무지를 선택하세요..";
				break;
			case "date": {
				const month = new Date().getMonth() + 1;
				displayValue = `${month}/${selectedDate}`;
				break;
			}
			case "startHour":
				displayValue = String(startHour).padStart(2, "0");
				break;
			case "startMinute":
				displayValue = String(startMinute).padStart(2, "0");
				break;
			case "endHour":
				displayValue = String(endHour).padStart(2, "0");
				break;
			case "endMinute":
				displayValue = String(endMinute).padStart(2, "0");
				break;
			case "breakMinutes":
				displayValue = String(breakMinutes);
				break;
		}

		const isPlaceholder = target === "workplace" && !selectedWorkplace;

		return (
			<TouchableOpacity
				style={[
					styles.selectField,
					activePicker === target && styles.selectFieldActive,
					style,
				]}
				onPress={() =>
					setActivePicker(activePicker === target ? null : target)
				}
				activeOpacity={0.7}
			>
				<Text
					weight={isPlaceholder ? "Regular" : "Medium"}
					style={[
						styles.selectText,
						isPlaceholder && styles.selectPlaceholder,
					]}
				>
					{displayValue}
				</Text>
				<Feather
					name="chevron-down"
					size={14}
					color={colors.textMuted}
				/>
			</TouchableOpacity>
		);
	};

	const pickerConfig = getPickerConfig();

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onClose}
			>
				<TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
					<View style={styles.handle} />

					<Text weight="Bold" style={styles.title}>
						근무 추가 요청하기
					</Text>

					{/* 근무지 */}
					<View style={styles.section}>
						<Text weight="Medium" style={styles.label}>
							근무지
						</Text>
						{renderSelectField("근무지", "workplace", {
							alignSelf: "flex-start",
						})}
					</View>

					{/* 근무 시간 */}
					<View style={styles.section}>
						<Text weight="Medium" style={styles.label}>
							근무 시간
						</Text>
						<View style={styles.timeRow}>
							{renderSelectField("날짜", "date", {
								flex: 0,
								minWidth: 70,
							})}
							{renderSelectField("시", "startHour", styles.timeField)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField("분", "startMinute", styles.timeField)}
							<Text weight="Medium" style={styles.timeTilde}>
								~
							</Text>
							{renderSelectField("시", "endHour", styles.timeField)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField("분", "endMinute", styles.timeField)}
						</View>
					</View>

					{/* 휴게 시간 & 시급 */}
					<View style={styles.rowSection}>
						<View style={styles.halfSection}>
							<Text weight="Medium" style={styles.label}>
								휴게 시간
							</Text>
							<View style={styles.unitRow}>
								{renderSelectField(
									"분",
									"breakMinutes",
									styles.smallField
								)}
								<Text weight="Medium" style={styles.unitText}>
									분
								</Text>
							</View>
						</View>
						<View style={styles.halfSection}>
							<Text weight="Medium" style={styles.label}>
								시급
							</Text>
							<View style={styles.unitRow}>
								<View style={styles.salaryField}>
									<Text weight="Medium" style={styles.salaryText}>
										{formatCurrency(salary)}
									</Text>
								</View>
								<Text weight="Medium" style={styles.unitText}>
									원
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
						<TouchableOpacity
							style={[
								styles.submitButton,
								!selectedWorkplaceId && styles.submitButtonDisabled,
							]}
							onPress={handleSubmit}
							activeOpacity={0.8}
							disabled={!selectedWorkplaceId}
						>
							<Feather name="send" size={16} color={colors.white} />
							<Text weight="Bold" style={styles.submitText}>
								요청 보내기
							</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: colors.white,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 12,
		paddingHorizontal: 24,
		paddingBottom: 40,
		maxHeight: "90%",
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: colors.grey,
		borderRadius: 2,
		alignSelf: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 20,
		color: colors.textPrimary,
		marginBottom: 24,
	},
	section: {
		marginBottom: 20,
		gap: 8,
	},
	label: {
		fontSize: 13,
		color: colors.textSecondary,
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
	selectPlaceholder: {
		color: colors.textMuted,
	},
	timeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	timeField: {
		flex: 0,
		minWidth: 48,
		paddingHorizontal: 8,
	},
	timeSeparator: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	timeTilde: {
		fontSize: 16,
		color: colors.textSecondary,
		marginHorizontal: 4,
	},
	rowSection: {
		flexDirection: "row",
		gap: 20,
		marginBottom: 20,
	},
	halfSection: {
		flex: 1,
		gap: 8,
	},
	unitRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	smallField: {
		flex: 0,
		minWidth: 52,
	},
	unitText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	salaryField: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		minWidth: 80,
	},
	salaryText: {
		fontSize: 14,
		color: colors.textPrimary,
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
		marginTop: 8,
	},
	submitButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: colors.primary,
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 28,
	},
	submitButtonDisabled: {
		backgroundColor: colors.textDisabled,
	},
	submitText: {
		fontSize: 15,
		color: colors.white,
	},
});

export default AddWorkRequestModal;
