import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../common/Text";
import EmployerWorkerCard from "./EmployerWorkerCard";
import { colors } from "../../../constants/colors";
import type { WorkRecord } from "../../../api/employer/types";

interface EmployerWorkerListSectionProps {
  workRecords: WorkRecord[];
  onPressAdd: () => void;
}

const EmployerWorkerListSection: React.FC<EmployerWorkerListSectionProps> = ({
  workRecords,
  onPressAdd,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (record: WorkRecord) => {
    setExpandedId((prev) => (prev === record.id ? null : record.id));
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text weight="Bold" style={styles.title}>
          근무자 리스트
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAdd}
          activeOpacity={0.7}
        >
          <Text weight="SemiBold" style={styles.addButtonText}>
            + 근무 추가
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카드 목록 */}
      {workRecords.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>이 날짜의 근무자가 없습니다</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {workRecords.map((record) => (
            <EmployerWorkerCard
              key={record.id}
              record={record}
              isExpanded={expandedId === record.id}
              onPressToggle={handleToggle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 12,
    color: colors.white,
  },
  list: {
    gap: 10,
  },
  empty: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default EmployerWorkerListSection;
