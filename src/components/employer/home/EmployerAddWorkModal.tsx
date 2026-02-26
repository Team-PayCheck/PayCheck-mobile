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
import { getDateItems } from "../../../constants/pickerItems";
import { useWorkTimePicker, workModalSharedStyles } from "../../../hooks/employer/useWorkTimePicker";
import type { TimePickerTarget } from "../../../hooks/employer/useWorkTimePicker";
import { getContractsByWorkplace, createWorkRecord } from "../../../api/employer";
import type { ContractWorker } from "../../../api/employer/types";

// Add 모달은 날짜 선택이 추가로 필요하므로 "date" 타겟 포함
type AddPickerTarget = "date" | TimePickerTarget;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 날짜 피커는 Add 모달 전용으로 별도 관리
  const [addActivePicker, setAddActivePicker] = useState<AddPickerTarget>(null);

  const {
    startHour, startMinute, endHour, endMinute, breakMinutes,
    isNextDay,
    handlePickerChange: handleTimePickerChange,
    getPickerConfig: getTimePickerConfig,
    getDisplayValue,
    resetTime,
    setActivePicker: setTimeActivePicker,
  } = useWorkTimePicker();

  const dateItems = useMemo(() => getDateItems(parsedDate), [parsedDate]);

  useEffect(() => {
    if (!visible) return;

    // 폼 초기화
    const d = new Date(selectedDate + "T00:00:00");
    setSelectedDay(d.getDate());
    resetTime();
    setSelectedContractId(null);
    setAddActivePicker(null);

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

  const togglePicker = (target: AddPickerTarget) => {
    setAddActivePicker((prev) => (prev === target ? null : target));
    // 훅의 activePicker도 동기화 (WheelPicker 렌더링용)
    setTimeActivePicker(target !== "date" ? target : null);
  };

  const handlePickerChange = (value: string | number) => {
    if (addActivePicker === "date") {
      setSelectedDay(value as number);
      return;
    }
    handleTimePickerChange(value);
  };

  const getPickerConfig = () => {
    if (addActivePicker === "date") {
      return { items: dateItems, selectedValue: selectedDay, width: 120 };
    }
    return getTimePickerConfig();
  };

  const getAddDisplayValue = (target: Exclude<AddPickerTarget, null>): string => {
    if (target === "date") {
      const month = parsedDate.getMonth() + 1;
      return `${month}/${selectedDay}`;
    }
    return getDisplayValue(target);
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

  const renderSelectField = (target: Exclude<AddPickerTarget, null>, style?: object) => (
    <TouchableOpacity
      style={[
        workModalSharedStyles.selectField,
        addActivePicker === target && workModalSharedStyles.selectFieldActive,
        style,
      ]}
      onPress={() => togglePicker(target)}
      activeOpacity={0.7}
    >
      <Text weight="Medium" style={workModalSharedStyles.selectText}>
        {getAddDisplayValue(target)}
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
      <View style={workModalSharedStyles.section}>
        <Text weight="Medium" style={workModalSharedStyles.label}>
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
          <Text weight="Medium" style={workModalSharedStyles.label}>
            근무지
          </Text>
          <View style={styles.readonlyField}>
            <Text weight="Medium" style={styles.readonlyText} numberOfLines={1}>
              {workplaceName}
            </Text>
          </View>
        </View>
        <View style={styles.halfSection}>
          <Text weight="Medium" style={workModalSharedStyles.label}>
            휴게 시간
          </Text>
          <View style={workModalSharedStyles.unitRow}>
            {renderSelectField("breakMinutes", workModalSharedStyles.smallField)}
            <Text weight="Medium" style={workModalSharedStyles.unitText}>
              분
            </Text>
          </View>
        </View>
      </View>

      {/* 근무 시간 */}
      <View style={workModalSharedStyles.section}>
        <Text weight="Medium" style={workModalSharedStyles.label}>
          근무 시간
        </Text>
        <View style={workModalSharedStyles.timeRow}>
          {renderSelectField("date", { flex: 0, minWidth: 70 })}
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

      {/* WheelPicker 영역 */}
      {addActivePicker && pickerConfig.items.length > 0 && (
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

      {/* 추가하기 버튼 */}
      <View style={workModalSharedStyles.submitRow}>
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
});

export default EmployerAddWorkModal;
