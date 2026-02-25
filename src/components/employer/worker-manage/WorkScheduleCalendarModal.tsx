import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import type { WorkScheduleRow } from "../../../types/employer/employer.types";

const HOUR_HEIGHT = 50; // px per hour
const TIME_LABEL_WIDTH = 52;
const HOURS_IN_RANGE = 12;
const TOTAL_GRID_HEIGHT = HOUR_HEIGHT * HOURS_IN_RANGE;
const SCREEN_WIDTH = Dimensions.get("window").width;
// 양쪽 패딩 24*2 (BottomSheetModal paddingHorizontal) 제외
const GRID_WIDTH = SCREEN_WIDTH - 48 - TIME_LABEL_WIDTH;
const COL_WIDTH = GRID_WIDTH / 7;

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_INDEX: Record<string, number> = {
  일요일: 0,
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
};

interface WorkScheduleCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  workerName: string;
  workSchedules: WorkScheduleRow[];
}

const WorkScheduleCalendarModal: React.FC<WorkScheduleCalendarModalProps> = ({
  visible,
  onClose,
  workerName,
  workSchedules,
}) => {
  const [showAM, setShowAM] = useState(true);

  const rangeStartMin = showAM ? 0 : 12 * 60; // 분 단위
  const rangeEndMin = showAM ? 12 * 60 : 24 * 60;
  const rangeStartHour = showAM ? 0 : 12;

  const hoursInRange = Array.from(
    { length: HOURS_IN_RANGE },
    (_, i) => rangeStartHour + i
  );

  /** 특정 요일 인덱스의 가시 범위 내 바 정보를 반환 */
  const getBarsForDay = (dayIndex: number) => {
    return workSchedules
      .filter((row) => DAY_INDEX[row.day] === dayIndex)
      .flatMap((row) => {
        const startMin =
          parseInt(row.startHour, 10) * 60 + parseInt(row.startMinute, 10);
        const endMin =
          parseInt(row.endHour, 10) * 60 + parseInt(row.endMinute, 10);

        const clippedStart = Math.max(startMin, rangeStartMin);
        const clippedEnd = Math.min(endMin, rangeEndMin);
        if (clippedStart >= clippedEnd) return [];

        const top = ((clippedStart - rangeStartMin) / 60) * HOUR_HEIGHT;
        const height = ((clippedEnd - clippedStart) / 60) * HOUR_HEIGHT;
        return [{ top, height, key: row.key }];
      });
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="88%">
      {/* 헤더: 타이틀 + 오전/오후 토글 */}
      <View style={styles.header}>
        <Text weight="Bold" style={styles.title}>
          근무 달력
        </Text>
        <View style={styles.ampmToggle}>
          <TouchableOpacity
            onPress={() => setShowAM(true)}
            activeOpacity={0.8}
          >
            <Text
              weight={showAM ? "SemiBold" : "Regular"}
              style={[styles.toggleText, showAM && styles.toggleTextActive]}
            >
              오전
            </Text>
          </TouchableOpacity>
          <Text style={styles.toggleDivider}>/</Text>
          <TouchableOpacity
            onPress={() => setShowAM(false)}
            activeOpacity={0.8}
          >
            <Text
              weight={!showAM ? "SemiBold" : "Regular"}
              style={[styles.toggleText, !showAM && styles.toggleTextActive]}
            >
              오후
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 요일 컬럼 헤더 */}
      <View style={styles.dayHeaderRow}>
        <View style={{ width: TIME_LABEL_WIDTH }} />
        {DAYS.map((day) => (
          <View key={day} style={[styles.dayHeaderCell, { width: COL_WIDTH }]}>
            <Text style={styles.dayHeaderText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 타임라인 그리드 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View style={[styles.gridContainer, { height: TOTAL_GRID_HEIGHT }]}>
          {/* 시간 레이블 + 가로 구분선 */}
          {hoursInRange.map((hour, i) => (
            <View
              key={hour}
              style={[styles.hourRow, { top: i * HOUR_HEIGHT }]}
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
              { left: TIME_LABEL_WIDTH, height: TOTAL_GRID_HEIGHT },
            ]}
          >
            {DAYS.map((_, dayIndex) => (
              <View
                key={dayIndex}
                style={[styles.dayColumn, { width: COL_WIDTH }]}
              >
                {getBarsForDay(dayIndex).map((bar) => (
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
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  ampmToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  toggleTextActive: {
    color: colors.textPrimary,
  },
  toggleDivider: {
    fontSize: 14,
    color: colors.textMuted,
  },
  // 요일 헤더
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeaderCell: {
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  // 그리드
  gridContainer: {
    position: "relative",
    width: "100%",
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
    width: TIME_LABEL_WIDTH,
    fontSize: 11,
    color: colors.textMuted,
    paddingTop: 2,
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
    marginTop: 6,
  },
  // 요일 컬럼
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
    left: 3,
    right: 3,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
    marginTop: 6,
  },
});

export default WorkScheduleCalendarModal;
