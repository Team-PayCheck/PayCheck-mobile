import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import PrimaryButton from "../../common/PrimaryButton";
import WheelPicker from "../../common/WheelPicker";
import useCorrectionForm from "../../../hooks/worker/useCorrectionForm";
import type { CorrectionPickerTarget } from "../../../hooks/worker/useCorrectionForm";
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

const WorkerCorrectionRequestModal: React.FC<
	WorkerCorrectionRequestModalProps
> = ({ visible, onClose, work, onSubmit }) => {
	const {
		original,
		activePicker,
		hasChanges,
		handlePickerChange,
		togglePicker,
		getPickerConfig,
		getDisplayValue,
		buildSubmitData,
	} = useCorrectionForm(work, visible);

	const handleSubmit = () => {
		const data = buildSubmitData();
		if (data) onSubmit(data);
	};

	if (!work || !original) return null;

	const pickerConfig = getPickerConfig();

	const renderReadonlyField = (value: string) => (
		<View style={styles.readonlyField}>
			<Text weight="Medium" style={styles.readonlyText}>
				{value}
			</Text>
		</View>
	);

	const renderSelectField = (
		target: CorrectionPickerTarget,
		displayValue: string
	) => (
		<TouchableOpacity
			style={[
				styles.selectField,
				activePicker === target && styles.selectFieldActive,
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
		<BottomSheetModal visible={visible} onClose={onClose}>
			<View>
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
								getDisplayValue("startDate")
							)}
							{renderSelectField(
								"startHour",
								getDisplayValue("startHour")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField(
								"startMinute",
								getDisplayValue("startMinute")
							)}
						</View>
						<Text weight="Medium" style={styles.tilde}>
							~
						</Text>
						<View style={styles.timeRow}>
							{renderSelectField(
								"endDate",
								getDisplayValue("endDate")
							)}
							{renderSelectField(
								"endHour",
								getDisplayValue("endHour")
							)}
							<Text style={styles.timeSeparator}>:</Text>
							{renderSelectField(
								"endMinute",
								getDisplayValue("endMinute")
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
								getDisplayValue("breakMinutes")
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
