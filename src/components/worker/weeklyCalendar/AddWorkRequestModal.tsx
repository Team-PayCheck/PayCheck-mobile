import React, { useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import WheelPicker from "../../common/WheelPicker";
import BottomSheetModal from "../../common/BottomSheetModal";
import useWorkplaces from "../../../hooks/worker/useWorkplaces";
import useWorkRequestForm from "../../../hooks/worker/useWorkRequestForm";
import type { PickerTarget } from "../../../hooks/worker/useWorkRequestForm";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";

interface AddWorkRequestModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (data: {
		contractId: number;
		requestedWorkDate: string;
		requestedStartTime: string;
		requestedEndTime: string;
		requestedBreakMinutes: number;
	}) => void;
}

const AddWorkRequestModal: React.FC<AddWorkRequestModalProps> = ({
	visible,
	onClose,
	onSubmit,
}) => {
	const { workplaces, isLoading, fetchWorkplaces, workplacePickerItems } =
		useWorkplaces();

	const {
		selectedWorkplaceId,
		activePicker,
		handlePickerChange,
		togglePicker,
		getPickerConfig,
		getDisplayValue,
		buildSubmitData,
	} = useWorkRequestForm(workplacePickerItems);

	useEffect(() => {
		if (visible) fetchWorkplaces();
	}, [visible]);

	const selectedWorkplace = workplaces.find(
		(wp) => wp.contractId === selectedWorkplaceId
	);
	const salary = selectedWorkplace?.hourlyWage ?? 0;

	const handleSubmit = () => {
		const data = buildSubmitData();
		if (data) onSubmit(data);
	};

	const pickerConfig = getPickerConfig();

	const renderSelectField = (
		target: PickerTarget,
		style?: object
	) => {
		const isWorkplace = target === "workplace";
		const displayValue = isWorkplace
			? (selectedWorkplace?.workplaceName ?? "근무지를 선택하세요..")
			: getDisplayValue(target);
		const isPlaceholder = isWorkplace && !selectedWorkplace;

		return (
			<TouchableOpacity
				style={[
					styles.selectField,
					activePicker === target && styles.selectFieldActive,
					style,
				]}
				onPress={() => togglePicker(target)}
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

	return (
		<BottomSheetModal visible={visible} onClose={onClose}>
			<Text weight="Bold" style={styles.title}>
				근무 추가 요청하기
			</Text>

			{/* 근무지 */}
			<View style={styles.section}>
				<Text weight="Medium" style={styles.label}>
					근무지
				</Text>
				{isLoading ? (
					<ActivityIndicator
						size="small"
						color={colors.primary}
						style={{ alignSelf: "flex-start", padding: 10 }}
					/>
				) : (
					renderSelectField("workplace", {
						alignSelf: "flex-start",
					})
				)}
			</View>

			{/* 근무 시간 */}
			<View style={styles.section}>
				<Text weight="Medium" style={styles.label}>
					근무 시간
				</Text>
				<View style={styles.timeRow}>
					{renderSelectField("date", {
						flex: 0,
						minWidth: 70,
					})}
					{renderSelectField("startHour", styles.timeField)}
					<Text style={styles.timeSeparator}>:</Text>
					{renderSelectField("startMinute", styles.timeField)}
					<Text weight="Medium" style={styles.timeTilde}>
						~
					</Text>
					{renderSelectField("endHour", styles.timeField)}
					<Text style={styles.timeSeparator}>:</Text>
					{renderSelectField("endMinute", styles.timeField)}
				</View>
			</View>

			{/* 휴게 시간 & 시급 */}
			<View style={styles.rowSection}>
				<View style={styles.halfSection}>
					<Text weight="Medium" style={styles.label}>
						휴게 시간
					</Text>
					<View style={styles.unitRow}>
						{renderSelectField("breakMinutes", styles.smallField)}
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
				<PrimaryButton
					text="요청 보내기"
					onPress={handleSubmit}
					disabled={!selectedWorkplaceId}
					icon={<Feather name="send" size={16} color={colors.white} />}
					size="compact"
				/>
			</View>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
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
});

export default AddWorkRequestModal;
