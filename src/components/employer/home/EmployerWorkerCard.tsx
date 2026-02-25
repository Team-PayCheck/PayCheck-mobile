import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency, formatTime } from "../../../utils/format";
import { getWorkStatus, WORK_STATUS_COLOR, type WorkStatus } from "../../../utils/workRecord";
import type { WorkRecord } from "../../../api/employer/types";

const STATUS_BADGE_STYLE: Record<WorkStatus, object> = {
  scheduled: { backgroundColor: WORK_STATUS_COLOR.scheduled },
  working: { backgroundColor: WORK_STATUS_COLOR.working },
  completed: { backgroundColor: WORK_STATUS_COLOR.completed },
};

const STATUS_LABEL: Record<WorkStatus, string> = {
  scheduled: "근무예정",
  working: "근무중",
  completed: "근무완료",
};

const StatusBadge: React.FC<{ record: WorkRecord }> = ({ record }) => {
  const status = getWorkStatus(record);
  const badgeStyle = STATUS_BADGE_STYLE[status];
  const label = STATUS_LABEL[status];

  return (
    <View style={[styles.statusBadge, badgeStyle]}>
      <Text weight="SemiBold" style={styles.statusText}>
        {label}
      </Text>
    </View>
  );
};

interface EmployerWorkerCardProps {
  record: WorkRecord;
  isExpanded: boolean;
  onPressToggle: (record: WorkRecord) => void;
  onDelete: (id: number) => void;
}

const EmployerWorkerCard: React.FC<EmployerWorkerCardProps> = ({
  record,
  isExpanded,
  onPressToggle,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "근무 삭제",
      `${record.workerName}의 근무 기록을 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => onDelete(record.id) },
      ]
    );
  };

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

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Feather name="trash-2" size={14} color={colors.deleteRed} />
            <Text weight="SemiBold" style={styles.deleteButtonText}>근무 삭제</Text>
          </TouchableOpacity>
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
  statusText: {
    fontSize: 11,
    color: colors.white,
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.deleteRed,
  },
  deleteButtonText: {
    fontSize: 13,
    color: colors.deleteRed,
  },
});

export default EmployerWorkerCard;
