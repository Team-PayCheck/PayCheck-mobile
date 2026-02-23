import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import WheelPicker from "../../common/WheelPicker";
import { HOUR_ITEMS, MINUTE_ITEMS } from "../../../constants/pickerItems";
import { colors } from "../../../constants/colors";
import type { WorkDay, WorkScheduleRow } from "../../../api/employer/types";

const DAY_OPTIONS: WorkDay[] = [
  "선택",
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

type PickerType =
  | "day"
  | "startHour"
  | "startMinute"
  | "endHour"
  | "endMinute";

interface WorkTimeRowProps {
  row: WorkScheduleRow;
  onChange: (updated: WorkScheduleRow) => void;
  onDelete: () => void;
  showDelete: boolean;
}

const WorkTimeRow: React.FC<WorkTimeRowProps> = ({
  row,
  onChange,
  onDelete,
  showDelete,
}) => {
  const [activePicker, setActivePicker] = useState<PickerType | null>(null);

  const update = (patch: Partial<WorkScheduleRow>) =>
    onChange({ ...row, ...patch });

  const renderPickerContent = () => {
    if (!activePicker) return null;

    if (activePicker === "day") {
      return (
        <View>
          <Text weight="SemiBold" style={styles.pickerTitle}>
            요일 선택
          </Text>
          {DAY_OPTIONS.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayOption,
                row.day === day && styles.dayOptionSelected,
              ]}
              onPress={() => {
                update({ day });
                setActivePicker(null);
              }}
              activeOpacity={0.7}
            >
              <Text
                weight={row.day === day ? "SemiBold" : "Regular"}
                style={[
                  styles.dayOptionText,
                  row.day === day && styles.dayOptionTextSelected,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    const timePickerMap: Record<
      Exclude<PickerType, "day">,
      {
        title: string;
        items: typeof HOUR_ITEMS;
        rowKey: "startHour" | "startMinute" | "endHour" | "endMinute";
      }
    > = {
      startHour: { title: "시작 시", items: HOUR_ITEMS, rowKey: "startHour" },
      startMinute: {
        title: "시작 분",
        items: MINUTE_ITEMS,
        rowKey: "startMinute",
      },
      endHour: { title: "종료 시", items: HOUR_ITEMS, rowKey: "endHour" },
      endMinute: {
        title: "종료 분",
        items: MINUTE_ITEMS,
        rowKey: "endMinute",
      },
    };

    const config = timePickerMap[activePicker as Exclude<PickerType, "day">];
    const currentValue = parseInt(
      row[config.rowKey] as string,
      10
    );

    return (
      <View style={styles.wheelPickerContainer}>
        <Text weight="SemiBold" style={styles.pickerTitle}>
          {config.title}
        </Text>
        <WheelPicker
          items={config.items}
          selectedValue={currentValue}
          onValueChange={(v) =>
            update({ [config.rowKey]: String(v).padStart(2, "0") })
          }
          width={120}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setActivePicker(null)}
          activeOpacity={0.8}
        >
          <Text weight="SemiBold" style={styles.confirmText}>
            확인
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={styles.row}>
        {/* 요일 선택 */}
        <TouchableOpacity
          style={styles.dayButton}
          onPress={() => setActivePicker("day")}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorText}>{row.day}</Text>
          <Feather name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* 시작 시간 */}
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setActivePicker("startHour")}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorText}>{row.startHour}</Text>
          <Feather name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.colon}>:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setActivePicker("startMinute")}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorText}>{row.startMinute}</Text>
          <Feather name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.tilde}>~</Text>

        {/* 종료 시간 */}
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setActivePicker("endHour")}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorText}>{row.endHour}</Text>
          <Feather name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.colon}>:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setActivePicker("endMinute")}
          activeOpacity={0.7}
        >
          <Text style={styles.selectorText}>{row.endMinute}</Text>
          <Feather name="chevron-down" size={12} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* 삭제 버튼 */}
        {showDelete ? (
          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="minus-circle" size={18} color={colors.red} />
          </TouchableOpacity>
        ) : (
          <View style={styles.deletePlaceholder} />
        )}
      </View>

      {/* 피커 모달 */}
      <BottomSheetModal
        visible={activePicker !== null}
        onClose={() => setActivePicker(null)}
        maxHeight="60%"
      >
        {renderPickerContent()}
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  dayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 72,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 6,
    minWidth: 42,
    justifyContent: "center",
  },
  selectorText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  colon: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tilde: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: 2,
  },
  deletePlaceholder: {
    width: 18,
  },
  // 피커 모달 내부
  pickerTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  dayOption: {
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dayOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dayOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  dayOptionTextSelected: {
    color: colors.primary,
  },
  wheelPickerContainer: {
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 16,
  },
  confirmText: {
    fontSize: 16,
    color: colors.white,
  },
});

export default WorkTimeRow;
