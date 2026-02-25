import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import type { WorkRecord } from "../../../api/employer/types";

const formatTime = (time: string): string => time.slice(0, 5);

const isCurrentlyWorking = (record: WorkRecord): boolean => {
  const now = new Date();
  const [startH, startM] = record.startTime.split(":").map(Number);
  const [endH, endM] = record.endTime.split(":").map(Number);

  const start = new Date(`${record.workDate}T00:00:00`);
  start.setHours(startH ?? 0, startM ?? 0, 0, 0);

  const end = new Date(`${record.workDate}T00:00:00`);
  end.setHours(endH ?? 0, endM ?? 0, 0, 0);

  return now >= start && now <= end;
};

const StatusBadge: React.FC<{ record: WorkRecord }> = ({ record }) => {
  const working = record.status === "SCHEDULED" && isCurrentlyWorking(record);
  const isScheduled = record.status === "SCHEDULED" && !working;

  const badgeStyle = working
    ? styles.statusWorking
    : isScheduled
      ? styles.statusScheduled
      : record.status === "PENDING_APPROVAL"
        ? styles.statusPending
        : record.status === "REJECTED"
          ? styles.statusRejected
          : styles.statusCompleted;

  const textStyle = working
    ? styles.statusTextWorking
    : isScheduled
      ? styles.statusTextScheduled
      : record.status === "PENDING_APPROVAL"
        ? styles.statusTextPending
        : record.status === "REJECTED"
          ? styles.statusTextRejected
          : styles.statusTextCompleted;

  const label = working
    ? "근무중"
    : isScheduled
      ? "근무예정"
      : record.status === "PENDING_APPROVAL"
        ? "승인대기"
        : record.status === "REJECTED"
          ? "거절됨"
          : "근무완료";

  return (
    <View style={[styles.statusBadge, badgeStyle]}>
      <Text weight="SemiBold" style={[styles.statusText, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

interface EmployerWorkerCardProps {
  record: WorkRecord;
  isExpanded: boolean;
  onPressToggle: (record: WorkRecord) => void;
}

const EmployerWorkerCard: React.FC<EmployerWorkerCardProps> = ({
  record,
  isExpanded,
  onPressToggle,
}) => {
  return (
    <View style={styles.card}>
      {/* 접힌 상태 - 항상 표시 */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => onPressToggle(record)}
        activeOpacity={0.7}
      >
        <View style={styles.logoContainer}>
          <Text weight="Bold" style={styles.logoText}>
            {record.workerName.charAt(0)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text weight="SemiBold" style={styles.workerName}>
            {record.workerName}
          </Text>
          <Text weight="Bold" style={styles.dateTime}>
            {formatTime(record.startTime)} ~ {formatTime(record.endTime)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <StatusBadge record={record} />
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.black}
          />
        </View>
      </TouchableOpacity>

      {/* 펼친 상태 - 토글 시 표시 */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>근무지</Text>
              <View style={styles.detailValueBox}>
                <Text weight="Medium" style={styles.detailValue}>
                  {record.workplaceName}
                </Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>휴게 시간</Text>
              <View style={styles.detailValueBox}>
                <Text weight="Medium" style={styles.detailValue}>
                  {record.breakMinutes ?? 0} 분
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>시급</Text>
              <View style={styles.detailValueBox}>
                <Text weight="Medium" style={styles.detailValue}>
                  {formatCurrency(record.hourlyWage)} 원
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  workerName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dateTime: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusWorking: {
    backgroundColor: colors.primary,
  },
  statusScheduled: {
    backgroundColor: colors.green,
  },
  statusCompleted: {
    backgroundColor: colors.grey,
  },
  statusPending: {
    backgroundColor: "#FFF3E0",
  },
  statusRejected: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 11,
  },
  statusTextWorking: {
    color: colors.white,
  },
  statusTextScheduled: {
    color: colors.white,
  },
  statusTextCompleted: {
    color: colors.textSecondary,
  },
  statusTextPending: {
    color: "#F57C00",
  },
  statusTextRejected: {
    color: colors.red,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  detailValueBox: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: 8,
    padding: 10,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});

export default EmployerWorkerCard;
