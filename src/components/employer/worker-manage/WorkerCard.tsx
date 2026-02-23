import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import WorkTimeRow from "./WorkTimeRow";
import WorkScheduleCalendarModal from "./WorkScheduleCalendarModal";
import { colors } from "../../../constants/colors";
import type {
  EmployerWorkerContract,
  WorkScheduleRow,
  ContractUpdateRequest,
} from "../../../api/employer/types";

interface WorkerCardProps {
  worker: EmployerWorkerContract;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (contractId: number, data: ContractUpdateRequest) => void;
  onResign: (contractId: number) => void;
}

let rowKeyCounter = 1000;
const newRowKey = () => `new-${rowKeyCounter++}`;

const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  isExpanded,
  onToggle,
  onUpdate,
  onResign,
}) => {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [hourlyWage, setHourlyWage] = useState(
    worker.hourlyWage.toLocaleString()
  );
  const [paymentDay, setPaymentDay] = useState(
    worker.paymentDay.toString()
  );
  const [fourMajorInsurance, setFourMajorInsurance] = useState(
    worker.fourMajorInsurance
  );
  const [incomeTax, setIncomeTax] = useState(worker.incomeTax);
  const [workSchedules, setWorkSchedules] = useState<WorkScheduleRow[]>(
    worker.workSchedules
  );

  // 카드가 열릴 때마다 폼 초기화
  useEffect(() => {
    if (isExpanded) {
      setHourlyWage(worker.hourlyWage.toLocaleString());
      setPaymentDay(worker.paymentDay.toString());
      setFourMajorInsurance(worker.fourMajorInsurance);
      setIncomeTax(worker.incomeTax);
      setWorkSchedules(worker.workSchedules);
    }
  }, [isExpanded]);

  const handleScheduleChange = (index: number, updated: WorkScheduleRow) => {
    setWorkSchedules((prev) =>
      prev.map((row, i) => (i === index ? updated : row))
    );
  };

  const handleAddSchedule = () => {
    setWorkSchedules((prev) => [
      ...prev,
      {
        key: newRowKey(),
        day: "선택",
        startHour: "00",
        startMinute: "00",
        endHour: "00",
        endMinute: "00",
      },
    ]);
  };

  const handleDeleteSchedule = (index: number) => {
    setWorkSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    const wage = parseInt(hourlyWage.replace(/,/g, ""), 10);
    const day = parseInt(paymentDay, 10);

    if (isNaN(wage) || wage <= 0) {
      Alert.alert("입력 오류", "올바른 시급을 입력해주세요.");
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      Alert.alert("입력 오류", "급여지급일은 1~31 사이로 입력해주세요.");
      return;
    }

    onUpdate(worker.contractId, {
      hourlyWage: wage,
      paymentDay: day,
      fourMajorInsurance,
      incomeTax,
      workSchedules,
    });
  };

  const handleResign = () => {
    Alert.alert(
      "퇴사 처리",
      `${worker.workerName} 근무자를 퇴사 처리하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "퇴사처리",
          style: "destructive",
          onPress: () => onResign(worker.contractId),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* ── 접힌 상태 헤더 ── */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {/* 아바타 */}
        <View style={styles.avatar}>
          <Text weight="Bold" style={styles.avatarText}>
            {worker.workerName.charAt(0)}
          </Text>
        </View>

        {/* 이름 + 근무 스케줄 */}
        <View style={styles.headerInfo}>
          <Text weight="Bold" style={styles.workerName}>
            {worker.workerName}
          </Text>
          <Text weight="Regular" style={styles.workDays}>
            {worker.workDaysSummary.join(" / ")}
          </Text>
        </View>

        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.black}
        />
      </TouchableOpacity>

      {/* ── 펼친 상태 폼 ── */}
      {isExpanded && (
        <View style={styles.form}>

          {/* 근무자 정보 수정 타이틀 */}
          <Text weight="SemiBold" style={styles.formTitle}>
            근무자 정보 수정
          </Text>

          {/* 시급 / 급여지급일 */}
          <View style={styles.inlineRow}>
            <View style={styles.inlineField}>
              <Text style={styles.fieldLabel}>시급</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.textInput}
                  value={hourlyWage}
                  onChangeText={(v) => {
                    const num = v.replace(/[^0-9]/g, "");
                    setHourlyWage(
                      num ? parseInt(num, 10).toLocaleString() : ""
                    );
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textDisabled}
                />
                <Text style={styles.unit}>원</Text>
              </View>
            </View>

            <View style={styles.inlineField}>
              <Text style={styles.fieldLabel}>급여지급일</Text>
              <View style={styles.inputWithUnit}>
                <Text style={styles.prefix}>매달</Text>
                <TextInput
                  style={[styles.textInput, styles.textInputNarrow]}
                  value={paymentDay}
                  onChangeText={setPaymentDay}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="1"
                  placeholderTextColor={colors.textDisabled}
                />
                <Text style={styles.unit}>일</Text>
              </View>
            </View>
          </View>

          {/* 4대보험 / 소득세 토글 */}
          <View style={styles.toggleDivider} />
          <View style={styles.inlineRow}>
            <View style={styles.toggleItem}>
              <Text style={styles.fieldLabel}>4대보험</Text>
              <Switch
                value={fourMajorInsurance}
                onValueChange={setFourMajorInsurance}
                trackColor={{ false: colors.disabled, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.toggleItem}>
              <Text style={styles.fieldLabel}>소득세</Text>
              <Switch
                value={incomeTax}
                onValueChange={setIncomeTax}
                trackColor={{ false: colors.disabled, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
          <View style={styles.toggleDivider} />

          {/* 근무시간 섹션 */}
          <View style={styles.scheduleSectionHeader}>
            <Text weight="SemiBold" style={styles.sectionTitle}>
              근무시간
            </Text>
            <TouchableOpacity
              style={styles.calendarViewButton}
              onPress={() => setCalendarVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.calendarViewText}>캘린더뷰</Text>
            </TouchableOpacity>
          </View>

          {workSchedules.map((row, index) => (
            <WorkTimeRow
              key={row.key}
              row={row}
              onChange={(updated) => handleScheduleChange(index, updated)}
              onDelete={() => handleDeleteSchedule(index)}
              showDelete={workSchedules.length > 1}
            />
          ))}

          {/* 근무 시간 추가 */}
          <TouchableOpacity
            style={styles.addScheduleButton}
            onPress={handleAddSchedule}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={14} color={colors.primary} />
            <Text weight="Medium" style={styles.addScheduleText}>
              근무 시간 추가
            </Text>
          </TouchableOpacity>

          {/* 하단 액션 버튼 */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.resignButton}
              onPress={handleResign}
              activeOpacity={0.8}
            >
              <Text weight="SemiBold" style={styles.resignText}>
                퇴사처리
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              activeOpacity={0.8}
            >
              <Feather name="edit-2" size={14} color={colors.textPrimary} />
              <Text weight="SemiBold" style={styles.updateText}>
                근무자 정보 수정
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* 근무 달력 모달 */}
      <WorkScheduleCalendarModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        workerName={worker.workerName}
        workSchedules={workSchedules}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  // 접힌 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  workDays: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  workerName: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  form: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.backgroundGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },
  textInputNarrow: {
    flex: 0,
    width: 32,
    textAlign: "center",
  },
  prefix: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  unit: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: -16,
  },
  toggleItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scheduleSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  calendarViewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  calendarViewText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addScheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 4,
  },
  addScheduleText: {
    fontSize: 12,
    color: colors.primary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  resignButton: {
    flex: 1,
    backgroundColor: colors.red,
    borderRadius: 20,
    height: 34,
    paddingVertical: 9,
    alignItems: "center",
  },
  resignText: {
    fontSize: 13,
    color: colors.white,
  },
  updateButton: {
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 34,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 5,
  },
  updateText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
});

export default WorkerCard;
