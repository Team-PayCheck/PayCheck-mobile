import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import WheelPicker from "../../common/WheelPicker";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import {
  HOUR_ITEMS,
  MINUTE_ITEMS,
  BREAK_ITEMS,
  getDateItems,
} from "../../../constants/pickerItems";
import { getContractsByWorkplace, createWorkRecord } from "../../../api/employer";
import type { ContractWorker } from "../../../api/employer/types";

type PickerTarget =
  | "date"
  | "startHour"
  | "startMinute"
  | "endHour"
  | "endMinute"
  | "breakMinutes"
  | null;

interface EmployerAddWorkModalProps {
  visible: boolean;
  onClose: () => void;
  workplaceId: number;
  workplaceName: string;
  selectedDate: string;
  onSuccess: () => void;
}

const EmployerAddWorkModal: React.FC<EmployerAddWorkModalProps> = ({
  visible,
  onClose,
  workplaceId,
  workplaceName,
  selectedDate,
  onSuccess,
}) => {
  const parsedDate = useMemo(() => new Date(selectedDate + "T00:00:00"), [selectedDate]);

  // 근무자 목록
  const [workers, setWorkers] = useState<ContractWorker[]>([]);
  const [isWorkersLoading, setIsWorkersLoading] = useState(false);

  // 폼 상태
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState(parsedDate.getDate());
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(18);
  const [endMinute, setEndMinute] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [activePicker, setActivePicker] = useState<PickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dateItems = useMemo(() => getDateItems(parsedDate), [parsedDate]);

  useEffect(() => {
    if (!visible) return;

    // 폼 초기화
    const d = new Date(selectedDate + "T00:00:00");
    setSelectedDay(d.getDate());
    setStartHour(9);
    setStartMinute(0);
    setEndHour(18);
    setEndMinute(0);
    setBreakMinutes(0);
    setSelectedContractId(null);
    setActivePicker(null);

    // 근무자 목록 조회
    const fetchWorkers = async () => {
      setIsWorkersLoading(true);
      try {
        const res = await getContractsByWorkplace(workplaceId);
        const list = (res.data ?? []) as ContractWorker[];
        setWorkers(list.filter((w) => w.isActive));
      } catch {
        setWorkers([]);
      } finally {
        setIsWorkersLoading(false);
      }
    };
    fetchWorkers();
  }, [visible, workplaceId, selectedDate]);

  const togglePicker = (target: PickerTarget) => {
    setActivePicker((prev) => (prev === target ? null : target));
  };

  const handlePickerChange = (value: string | number) => {
    switch (activePicker) {
      case "date":
        setSelectedDay(value as number);
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

  const getPickerConfig = () => {
    switch (activePicker) {
      case "date":
        return { items: dateItems, selectedValue: selectedDay, width: 120 };
      case "startHour":
        return { items: HOUR_ITEMS, selectedValue: startHour, width: 80 };
      case "startMinute":
        return { items: MINUTE_ITEMS, selectedValue: startMinute, width: 80 };
      case "endHour":
        return { items: HOUR_ITEMS, selectedValue: endHour, width: 80 };
      case "endMinute":
        return { items: MINUTE_ITEMS, selectedValue: endMinute, width: 80 };
      case "breakMinutes":
        return { items: BREAK_ITEMS, selectedValue: breakMinutes, width: 80 };
      default:
        return { items: [], selectedValue: 0, width: 80 };
    }
  };

  const getDisplayValue = (target: Exclude<PickerTarget, null>): string => {
    const month = parsedDate.getMonth() + 1;
    switch (target) {
      case "date":
        return `${month}/${selectedDay}`;
      case "startHour":
        return String(startHour).padStart(2, "0");
      case "startMinute":
        return String(startMinute).padStart(2, "0");
      case "endHour":
        return String(endHour).padStart(2, "0");
      case "endMinute":
        return String(endMinute).padStart(2, "0");
      case "breakMinutes":
        return String(breakMinutes);
    }
  };

  const handleSubmit = async () => {
    if (!selectedContractId) {
      Alert.alert("알림", "근무자를 선택해주세요.");
      return;
    }
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const workDate = `${year}-${String(month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const startTime = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

    setIsSubmitting(true);
    try {
      await createWorkRecord({
        contractId: selectedContractId,
        workDate,
        startTime,
        endTime,
        breakMinutes,
      });
      onSuccess();
      onClose();
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.error?.message ?? "근무 추가에 실패했습니다.")
        : "근무 추가에 실패했습니다.";
      Alert.alert("추가 실패", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickerConfig = getPickerConfig();

  const renderSelectField = (
    target: Exclude<PickerTarget, null>,
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
        {getDisplayValue(target)}
      </Text>
      <Feather name="chevron-down" size={14} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <Text weight="Bold" style={styles.title}>
        근무 추가하기
      </Text>

      {/* 근무지 */}
      <View style={styles.workplaceRow}>
        <View style={styles.workplaceDisplay}>
          <Text weight="Bold" style={styles.workplaceName}>
            {workplaceName}
          </Text>
          <Feather name="chevron-down" size={18} color={colors.textMuted} />
        </View>
      </View>

      {/* 근무자 선택 */}
      <View style={styles.section}>
        <Text weight="Medium" style={styles.label}>
          근무자 선택
        </Text>
        {isWorkersLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ alignSelf: "flex-start", padding: 8 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {workers.map((worker) => {
              const isSelected = selectedContractId === worker.id;
              return (
                <TouchableOpacity
                  key={worker.id}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedContractId(worker.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    weight={isSelected ? "SemiBold" : "Regular"}
                    style={[styles.chipText, isSelected && styles.chipTextSelected]}
                  >
                    {worker.workerName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* 근무지 + 휴게 시간 */}
      <View style={styles.rowSection}>
        <View style={styles.halfSection}>
          <Text weight="Medium" style={styles.label}>
            근무지
          </Text>
          <View style={styles.readonlyField}>
            <Text weight="Medium" style={styles.readonlyText} numberOfLines={1}>
              {workplaceName}
            </Text>
          </View>
        </View>
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
      </View>

      {/* 근무 시간 */}
      <View style={styles.section}>
        <Text weight="Medium" style={styles.label}>
          근무 시간
        </Text>
        <View style={styles.timeRow}>
          {renderSelectField("date", { flex: 0, minWidth: 70 })}
          {renderSelectField("startHour", styles.timeField)}
          <Text style={styles.timeSeparator}>:</Text>
          {renderSelectField("startMinute", styles.timeField)}
          <Text weight="Medium" style={styles.timeTilde}>~</Text>
          {renderSelectField("endHour", styles.timeField)}
          <Text style={styles.timeSeparator}>:</Text>
          {renderSelectField("endMinute", styles.timeField)}
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

      {/* 추가하기 버튼 */}
      <View style={styles.submitRow}>
        <PrimaryButton
          text="추가하기"
          onPress={handleSubmit}
          disabled={!selectedContractId || isSubmitting}
          icon={<Feather name="plus" size={16} color={colors.white} />}
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
    marginBottom: 20,
  },
  workplaceRow: {
    marginBottom: 16,
  },
  workplaceDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workplaceName: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.backgroundGrey,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.white,
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
  readonlyField: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readonlyText: {
    fontSize: 14,
    color: colors.textMuted,
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
});

export default EmployerAddWorkModal;
