import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import { isAxiosError } from "axios";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import WorkTimeRow from "./WorkTimeRow";
import { colors } from "../../../constants/colors";
import useAddWorker from "../../../hooks/employer/useAddWorker";
import {
  SCHEDULE_DAYS,
  SCHEDULE_TIME_LABEL_WIDTH,
  getScheduleBarsForDay,
} from "../../../utils/employerSchedule";

// ─── 스케줄 차트 상수 ───
const HOUR_HEIGHT = 30;
const HOURS_IN_DAY = 24;
const TOTAL_GRID_HEIGHT = HOUR_HEIGHT * HOURS_IN_DAY;

interface AddWorkerModalProps {
  visible: boolean;
  onClose: () => void;
  workplaceId: number;
  workplaceName: string;
  onSuccess: (contractId: number) => void;
}

const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  visible,
  onClose,
  workplaceId,
  workplaceName,
  onSuccess,
}) => {
  const { width } = useWindowDimensions();
  const GRID_WIDTH = width - 48 - SCHEDULE_TIME_LABEL_WIDTH;
  const COL_WIDTH = GRID_WIDTH / 7;
  const {
    step,
    workerCode,
    setWorkerCode,
    isSearching,
    searchedWorker,
    hourlyWage,
    setHourlyWage,
    paymentDay,
    setPaymentDay,
    fourMajorInsurance,
    setFourMajorInsurance,
    incomeTax,
    setIncomeTax,
    scheduleRows,
    isSubmitting,
    handleSearch,
    goToStep2,
    goToStep1,
    handleAddRow,
    handleDeleteRow,
    handleRowChange,
    handleSubmit,
    reset,
  } = useAddWorker();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirmSubmit = async () => {
    try {
      const contractId = await handleSubmit(workplaceId);
      Alert.alert("추가 성공", "근무자가 추가되었습니다.");
      reset();
      onSuccess(contractId);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const errorCode = (error.response.data as { errorCode?: string })?.errorCode;
        if (errorCode === "DUPLICATE_CONTRACT") {
          Alert.alert("추가 실패", "이미 해당 사업장에 계약이 존재하는 근로자입니다.");
          return;
        }
      }
      Alert.alert("추가 실패", "근무자 추가가 실패하였습니다.");
    }
  };

  // ─── Step 1: 근무자 검색 + 기본정보 + 근무조건 ───
  const renderStep1 = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text weight="Bold" style={styles.title}>
        근무자 신규 등록 (1/2)
      </Text>

      {/* 근무자 코드 */}
      <Text weight="Medium" style={styles.sectionLabel}>
        근무자코드
      </Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.codeInput}
          value={workerCode}
          onChangeText={setWorkerCode}
          placeholder="코드를 입력하세요"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={isSearching}
          activeOpacity={0.7}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text weight="Medium" style={styles.searchButtonText}>
              검색
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 검색 결과가 있을 때만 표시 */}
      {searchedWorker && (
        <>
          {/* 기본정보 */}
          <View style={styles.divider} />
          <Text weight="Medium" style={styles.sectionLabel}>
            기본정보
          </Text>
          <View style={styles.basicInfoRow}>
            <View style={styles.avatar}>
              <Feather name="user" size={28} color={colors.textMuted} />
            </View>
            <View style={styles.workerInfoTexts}>
              <Text weight="SemiBold" style={styles.workerName}>
                {searchedWorker.name}
              </Text>
              {!!searchedWorker.phone && (
                <Text style={styles.workerPhone}>{searchedWorker.phone}</Text>
              )}
            </View>
          </View>

          {/* 근무지 */}
          <View style={styles.divider} />
          <Text weight="Medium" style={styles.sectionLabel}>
            근무지
          </Text>
          <View style={styles.workplaceChip}>
            <Text weight="Medium" style={styles.workplaceChipText}>
              {workplaceName}
            </Text>
          </View>

          {/* 시급 + 급여지급일 */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldGroup}>
              <Text weight="Medium" style={styles.fieldLabel}>
                시급
              </Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.numericInput}
                  value={hourlyWage}
                  onChangeText={setHourlyWage}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <Text style={styles.unit}>원</Text>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text weight="Medium" style={styles.fieldLabel}>
                급여지급일
              </Text>
              <View style={styles.paydayRow}>
                <Text style={styles.paydayPrefix}>매달</Text>
                <TextInput
                  style={[styles.numericInput, styles.paydayInput]}
                  value={paymentDay}
                  onChangeText={setPaymentDay}
                  keyboardType="numeric"
                  maxLength={2}
                  selectTextOnFocus
                />
                <Text style={styles.unit}>일</Text>
              </View>
            </View>
          </View>

          {/* 4대보험 / 소득세 토글 */}
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleItem}>
              <Text weight="Medium" style={styles.toggleLabel}>
                4대보험
              </Text>
              <Switch
                value={fourMajorInsurance}
                onValueChange={setFourMajorInsurance}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.toggleItem}>
              <Text weight="Medium" style={styles.toggleLabel}>
                소득세
              </Text>
              <Switch
                value={incomeTax}
                onValueChange={setIncomeTax}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          {/* 다음 단계 버튼 */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={goToStep2}
            activeOpacity={0.8}
          >
            <Text weight="SemiBold" style={styles.nextButtonText}>
              다음 단계
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  // ─── Step 2: 근무시간 설정 + 스케줄 차트 ───
  const renderStep2 = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
    >
      <Text weight="Bold" style={styles.title}>
        근무자 신규 등록 (2/2)
      </Text>

      <Text weight="Medium" style={styles.sectionLabel}>
        근무시간
      </Text>

      {scheduleRows.map((row) => (
        <WorkTimeRow
          key={row.key}
          row={row}
          onChange={(updated) => handleRowChange(row.key, updated)}
          onDelete={() => handleDeleteRow(row.key)}
          showDelete={scheduleRows.length > 1}
        />
      ))}

      <TouchableOpacity
        style={styles.addRowButton}
        onPress={handleAddRow}
        activeOpacity={0.7}
      >
        <Feather name="plus" size={14} color={colors.primary} />
        <Text weight="Medium" style={styles.addRowText}>
          행 추가
        </Text>
      </TouchableOpacity>

      {/* 스케줄 차트 */}
      <View style={styles.divider} />

      {/* 요일 헤더 */}
      <View style={styles.dayHeaderRow}>
        <View style={{ width: SCHEDULE_TIME_LABEL_WIDTH }} />
        {SCHEDULE_DAYS.map((day) => (
          <View key={day} style={[styles.dayHeaderCell, { width: COL_WIDTH }]}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 타임라인 그리드 */}
      <ScrollView
        style={styles.chartScroll}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: TOTAL_GRID_HEIGHT, position: "relative" }}>
          {/* 시간 레이블 + 구분선 */}
          {Array.from({ length: HOURS_IN_DAY }, (_, i) => i).map((hour) => (
            <View
              key={hour}
              style={[styles.hourRow, { top: hour * HOUR_HEIGHT }]}
            >
              <Text style={styles.hourLabel}>
                {String(hour).padStart(2, "0")}:00
              </Text>
              <View style={styles.hourLine} />
            </View>
          ))}

          {/* 요일별 바 컬럼 */}
          <View
            style={[
              styles.columnsContainer,
              { left: SCHEDULE_TIME_LABEL_WIDTH, height: TOTAL_GRID_HEIGHT },
            ]}
          >
            {SCHEDULE_DAYS.map((_, dayIndex) => (
              <View
                key={dayIndex}
                style={[styles.dayColumn, { width: COL_WIDTH }]}
              >
                {getScheduleBarsForDay(scheduleRows, dayIndex, HOUR_HEIGHT).map((bar) => (
                  <View
                    key={bar.key}
                    style={[
                      styles.workBar,
                      { top: bar.top, height: Math.max(bar.height, 4) },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={goToStep1}
          activeOpacity={0.8}
        >
          <Text weight="Medium" style={styles.prevButtonText}>
            이전단계
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleConfirmSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Feather name="plus" size={14} color={colors.white} />
              <Text weight="SemiBold" style={styles.submitButtonText}>
                추가하기
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <BottomSheetModal visible={visible} onClose={handleClose} maxHeight="95%">
      {step === 1 ? renderStep1() : renderStep2()}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },

  // ─── 근무자 코드 검색 ───
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: "Pretendard-Regular",
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    fontSize: 14,
    color: colors.white,
  },

  // ─── 기본 정보 ───
  basicInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  workerInfoTexts: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  workerPhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  // ─── 근무지 칩 ───
  workplaceChip: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  workplaceChipText: {
    fontSize: 14,
    color: colors.primary,
  },

  // ─── 시급 + 급여지급일 ───
  fieldRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  fieldGroup: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  numericInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: "Pretendard-Regular",
    minWidth: 80,
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paydayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paydayPrefix: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paydayInput: {
    minWidth: 40,
    textAlign: "center",
  },

  // ─── 토글 ───
  toggleRow: {
    flexDirection: "row",
    gap: 24,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  // ─── 다음 단계 버튼 ───
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: colors.white,
  },

  // ─── Step 2: 행 추가 버튼 ───
  addRowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingVertical: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  addRowText: {
    fontSize: 13,
    color: colors.primary,
  },

  // ─── 스케줄 차트 ───
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayHeaderCell: {
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartScroll: {
    height: 280,
  },
  hourRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    height: HOUR_HEIGHT,
  },
  hourLabel: {
    width: SCHEDULE_TIME_LABEL_WIDTH,
    fontSize: 10,
    color: colors.textMuted,
    paddingTop: 2,
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: 5,
  },
  columnsContainer: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    top: 0,
  },
  dayColumn: {
    position: "relative",
  },
  workBar: {
    position: "absolute",
    left: 2,
    right: 2,
    backgroundColor: colors.lightBlue,
    borderRadius: 3,
    marginTop: 5,
  },

  // ─── 하단 버튼 ───
  bottomButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 8,
    gap: 12,
  },
  prevButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  prevButtonText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    color: colors.white,
  },
});

export default AddWorkerModal;
