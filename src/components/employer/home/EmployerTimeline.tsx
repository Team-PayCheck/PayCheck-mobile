import React, { useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import type { WorkRecord } from "../../../api/employer/types";

const HOUR_WIDTH = 64;
const TOTAL_WIDTH = 24 * HOUR_WIDTH;
const BAR_HEIGHT = 60;
const ROW_GAP = 8;
const TIME_HEADER_HEIGHT = 30;
const TIME_LABELS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

const getBarColor = (record: WorkRecord): string => {
  const now = new Date();
  const [startH, startM] = record.startTime.split(":").map(Number);
  const [endH, endM] = record.endTime.split(":").map(Number);

  const start = new Date(`${record.workDate}T00:00:00`);
  start.setHours(startH ?? 0, startM ?? 0, 0, 0);

  const end = new Date(`${record.workDate}T00:00:00`);
  end.setHours(endH ?? 0, endM ?? 0, 0, 0);

  if (now < start) return colors.green;
  if (now <= end) return colors.primary;
  return colors.grey;
};

const timeToMinutes = (time: string): number => {
  const [h = "0", m = "0"] = time.split(":");
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};

const formatTime = (time: string): string => time.slice(0, 5);

const minutesToX = (minutes: number): number =>
  (minutes / (24 * 60)) * TOTAL_WIDTH;

interface EmployerTimelineProps {
  workRecords: WorkRecord[];
}

const EmployerTimeline: React.FC<EmployerTimelineProps> = ({ workRecords }) => {
  const scrollRef = useRef<ScrollView>(null);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentX = minutesToX(currentMinutes);

  useEffect(() => {
    const scrollX = Math.max(0, currentX - 100);
    const timer = setTimeout(
      () => scrollRef.current?.scrollTo({ x: scrollX, animated: false }),
      150
    );
    return () => clearTimeout(timer);
  }, []);

  const barsAreaHeight =
    workRecords.length > 0
      ? workRecords.length * (BAR_HEIGHT + ROW_GAP) + ROW_GAP
      : 80;

  return (
    <View style={styles.outer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ width: TOTAL_WIDTH }}>
          {/* 시간 축 헤더 */}
          <View style={[styles.timeHeader, { height: TIME_HEADER_HEIGHT }]}>
            {TIME_LABELS.map((hour) => (
              <View
                key={hour}
                style={[styles.timeLabelWrap, { left: hour * HOUR_WIDTH - 16 }]}
              >
                <Text style={styles.timeLabel}>
                  {String(hour).padStart(2, "0")}:00
                </Text>
              </View>
            ))}
          </View>

          {/* 바 영역 */}
          <View style={{ height: barsAreaHeight, position: "relative" }}>
            {/* 수직 그리드 라인 */}
            {TIME_LABELS.map((hour) => (
              <View
                key={hour}
                style={[
                  styles.gridLine,
                  { left: hour * HOUR_WIDTH, height: barsAreaHeight },
                ]}
              />
            ))}

            {/* 현재 시각 붉은 선 */}
            <View
              style={[
                styles.currentTimeLine,
                { left: currentX, height: barsAreaHeight },
              ]}
            >
              <View style={styles.currentTimeDot} />
            </View>

            {/* 빈 상태 */}
            {workRecords.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>근무 기록이 없습니다</Text>
              </View>
            )}

            {/* 근무자 바 */}
            {workRecords.map((record, index) => {
              const startMin = timeToMinutes(record.startTime);
              let endMin = timeToMinutes(record.endTime);
              if (endMin <= startMin) endMin += 24 * 60; // 자정 넘는 근무
              const barLeft = minutesToX(startMin);
              const barWidth = Math.max(minutesToX(endMin - startMin), 48);
              const barTop = ROW_GAP + index * (BAR_HEIGHT + ROW_GAP);
              const barColor = getBarColor(record);

              return (
                <View
                  key={record.id}
                  style={[
                    styles.bar,
                    {
                      left: barLeft,
                      width: barWidth,
                      top: barTop,
                      height: BAR_HEIGHT,
                      backgroundColor: barColor,
                    },
                  ]}
                >
                  <Text weight="SemiBold" style={styles.barName} numberOfLines={1}>
                    {record.workerName}
                  </Text>
                  <Text style={styles.barSub} numberOfLines={1}>
                    {record.workplaceName}
                  </Text>
                  <Text style={styles.barTime} numberOfLines={1}>
                    {formatTime(record.startTime)}~{formatTime(record.endTime)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  timeHeader: {
    position: "relative",
    backgroundColor: colors.backgroundGrey,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  timeLabelWrap: {
    position: "absolute",
    bottom: 6,
    width: 40,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  gridLine: {
    position: "absolute",
    width: 1,
    backgroundColor: colors.borderLight,
    top: 0,
  },
  currentTimeLine: {
    position: "absolute",
    width: 1.5,
    backgroundColor: colors.red,
    top: 0,
    opacity: 0.7,
  },
  currentTimeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.red,
    marginLeft: -3,
    marginTop: -2,
  },
  bar: {
    position: "absolute",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
  },
  barName: {
    fontSize: 12,
    color: colors.white,
  },
  barSub: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.85,
  },
  barTime: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.85,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});

export default EmployerTimeline;
