import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import WheelPicker from "../../common/WheelPicker";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import { useWorkTimePicker, workModalSharedStyles } from "../../../hooks/employer/useWorkTimePicker";
import { updateWorkRecord } from "../../../api/employer";
import type { WorkRecord } from "../../../api/employer/types";

interface EmployerEditWorkModalProps {
  visible: boolean;
  onClose: () => void;
  record: WorkRecord | null;
  onSuccess: () => void;
}

const EmployerEditWorkModal: React.FC<EmployerEditWorkModalProps> = ({
  visible,
  onClose,
  record,
  onSuccess,
}) => {
  const {
    startHour, startMinute, endHour, endMinute, breakMinutes,
    activePicker, isNextDay,
    togglePicker, handlePickerChange, getPickerConfig, getDisplayValue,
    resetTime,
  } = useWorkTimePicker();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (!visible || !record) return;

    const [sh, sm] = record.startTime.split(":").map(Number);
    const [eh, em] = record.endTime.split(":").map(Number);
    resetTime(sh ?? 9, sm ?? 0, eh ?? 18, em ?? 0, record.breakMinutes ?? 0);
  }, [visible, record]);

  const handleSubmit = async () => {
    if (!record) return;
    const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

    setIsSubmitting(true);
    try {
      await updateWorkRecord(record.id, { startTime, endTime, breakMinutes });
      Alert.alert("완료", "근무 정보가 수정되었습니다.");
      onSuccess();
      onClose();
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.error?.message ?? "근무 수정에 실패했습니다.")
        : "근무 수정에 실패했습니다.";
      Alert.alert("수정 실패", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickerConfig = getPickerConfig();

  const renderSelectField = (target: "startHour" | "startMinute" | "endHour" | "endMinute" | "breakMinutes", style?: object) => (
    <TouchableOpacity
      style={[workModalSharedStyles.selectField, activePicker === target && workModalSharedStyles.selectFieldActive, style]}
      onPress={() => togglePicker(target)}
      activeOpacity={0.7}
    >
      <Text weight="Medium" style={workModalSharedStyles.selectText}>
        {getDisplayValue(target)}
      </Text>
      <Feather name="chevron-down" size={14} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <Text weight="Bold" style={styles.title}>근무 수정</Text>
      {record && (
        <Text style={styles.workerName}>{record.workerName}</Text>
      )}

      {/* 근무 시간 */}
      <View style={workModalSharedStyles.section}>
        <Text weight="Medium" style={workModalSharedStyles.label}>근무 시간</Text>
        <View style={workModalSharedStyles.timeRow}>
          {renderSelectField("startHour", workModalSharedStyles.timeField)}
          <Text style={workModalSharedStyles.timeSeparator}>:</Text>
          {renderSelectField("startMinute", workModalSharedStyles.timeField)}
          <Text weight="Medium" style={workModalSharedStyles.timeTilde}>~</Text>
          {renderSelectField("endHour", workModalSharedStyles.timeField)}
          <Text style={workModalSharedStyles.timeSeparator}>:</Text>
          {renderSelectField("endMinute", workModalSharedStyles.timeField)}
        </View>
        {isNextDay && (
          <View style={workModalSharedStyles.nextDayRow}>
            <View style={workModalSharedStyles.nextDayBadge}>
              <Text weight="SemiBold" style={workModalSharedStyles.nextDayText}>익일</Text>
            </View>
          </View>
        )}
      </View>

      {/* 휴게 시간 */}
      <View style={workModalSharedStyles.section}>
        <Text weight="Medium" style={workModalSharedStyles.label}>휴게 시간</Text>
        <View style={workModalSharedStyles.unitRow}>
          {renderSelectField("breakMinutes", workModalSharedStyles.smallField)}
          <Text weight="Medium" style={workModalSharedStyles.unitText}>분</Text>
        </View>
      </View>

      {/* WheelPicker */}
      {activePicker && pickerConfig.items.length > 0 && (
        <View style={workModalSharedStyles.pickerArea}>
          <View style={workModalSharedStyles.pickerWrapper}>
            <WheelPicker
              items={pickerConfig.items}
              selectedValue={pickerConfig.selectedValue}
              onValueChange={handlePickerChange}
              width={pickerConfig.width}
            />
          </View>
        </View>
      )}

      {/* 수정하기 버튼 */}
      <View style={workModalSharedStyles.submitRow}>
        <PrimaryButton
          text="수정하기"
          onPress={handleSubmit}
          disabled={isSubmitting}
          icon={<Feather name="check" size={16} color={colors.white} />}
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
    marginBottom: 4,
  },
  workerName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});

export default EmployerEditWorkModal;
