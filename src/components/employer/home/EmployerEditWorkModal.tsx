import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import WheelPicker from "../../common/WheelPicker";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import { HOUR_ITEMS, MINUTE_ITEMS, BREAK_ITEMS } from "../../../constants/pickerItems";
import { updateWorkRecord } from "../../../api/employer";
import type { WorkRecord } from "../../../api/employer/types";

type PickerTarget =
  | "startHour"
  | "startMinute"
  | "endHour"
  | "endMinute"
  | "breakMinutes"
  | null;

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
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(18);
  const [endMinute, setEndMinute] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [activePicker, setActivePicker] = useState<PickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !record) return;

    const [sh, sm] = record.startTime.split(":").map(Number);
    const [eh, em] = record.endTime.split(":").map(Number);
    setStartHour(sh ?? 9);
    setStartMinute(sm ?? 0);
    setEndHour(eh ?? 18);
    setEndMinute(em ?? 0);
    setBreakMinutes(record.breakMinutes ?? 0);
    setActivePicker(null);
  }, [visible, record]);

  const togglePicker = (target: PickerTarget) => {
    setActivePicker((prev) => (prev === target ? null : target));
  };

  const handlePickerChange = (value: string | number) => {
    switch (activePicker) {
      case "startHour": setStartHour(value as number); break;
      case "startMinute": setStartMinute(value as number); break;
      case "endHour": setEndHour(value as number); break;
      case "endMinute": setEndMinute(value as number); break;
      case "breakMinutes": setBreakMinutes(value as number); break;
    }
  };

  const getPickerConfig = () => {
    switch (activePicker) {
      case "startHour": return { items: HOUR_ITEMS, selectedValue: startHour, width: 80 };
      case "startMinute": return { items: MINUTE_ITEMS, selectedValue: startMinute, width: 80 };
      case "endHour": return { items: HOUR_ITEMS, selectedValue: endHour, width: 80 };
      case "endMinute": return { items: MINUTE_ITEMS, selectedValue: endMinute, width: 80 };
      case "breakMinutes": return { items: BREAK_ITEMS, selectedValue: breakMinutes, width: 80 };
      default: return { items: [], selectedValue: 0, width: 80 };
    }
  };

  const getDisplayValue = (target: Exclude<PickerTarget, null>): string => {
    switch (target) {
      case "startHour": return String(startHour).padStart(2, "0");
      case "startMinute": return String(startMinute).padStart(2, "0");
      case "endHour": return String(endHour).padStart(2, "0");
      case "endMinute": return String(endMinute).padStart(2, "0");
      case "breakMinutes": return String(breakMinutes);
    }
  };

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

  const renderSelectField = (target: Exclude<PickerTarget, null>, style?: object) => (
    <TouchableOpacity
      style={[styles.selectField, activePicker === target && styles.selectFieldActive, style]}
      onPress={() => togglePicker(target)}
      activeOpacity={0.7}
    >
      <Text weight="Medium" style={styles.selectText}>
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
      <View style={styles.section}>
        <Text weight="Medium" style={styles.label}>근무 시간</Text>
        <View style={styles.timeRow}>
          {renderSelectField("startHour", styles.timeField)}
          <Text style={styles.timeSeparator}>:</Text>
          {renderSelectField("startMinute", styles.timeField)}
          <Text weight="Medium" style={styles.timeTilde}>~</Text>
          {renderSelectField("endHour", styles.timeField)}
          <Text style={styles.timeSeparator}>:</Text>
          {renderSelectField("endMinute", styles.timeField)}
        </View>
        {endHour * 60 + endMinute < startHour * 60 + startMinute && (
          <View style={styles.nextDayRow}>
            <View style={styles.nextDayBadge}>
              <Text weight="SemiBold" style={styles.nextDayText}>익일</Text>
            </View>
          </View>
        )}
      </View>

      {/* 휴게 시간 */}
      <View style={styles.section}>
        <Text weight="Medium" style={styles.label}>휴게 시간</Text>
        <View style={styles.unitRow}>
          {renderSelectField("breakMinutes", styles.smallField)}
          <Text weight="Medium" style={styles.unitText}>분</Text>
        </View>
      </View>

      {/* WheelPicker */}
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

      {/* 수정하기 버튼 */}
      <View style={styles.submitRow}>
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
  section: {
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
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
  nextDayRow: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  nextDayBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  nextDayText: {
    fontSize: 11,
    color: colors.primary,
  },
});

export default EmployerEditWorkModal;
