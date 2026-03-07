import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { showError } from "../../../utils/alert";
import { Text } from "../../common/Text";
import EmployerWorkerCard from "./EmployerWorkerCard";
import EmployerEditWorkModal from "./EmployerEditWorkModal";
import { colors } from "../../../constants/colors";
import { deleteWorkRecord } from "../../../api/employer";
import type { WorkRecord } from "../../../api/employer/types";

interface EmployerWorkerListSectionProps {
  workRecords: WorkRecord[];
  onPressAdd: () => void;
  onDeleteItem: (id: number) => void;
  onRefetch: () => void;
}

const EmployerWorkerListSection: React.FC<EmployerWorkerListSectionProps> = ({
  workRecords,
  onPressAdd,
  onDeleteItem,
  onRefetch,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<WorkRecord | null>(null);

  const handleToggle = (record: WorkRecord) => {
    setExpandedId((prev) => (prev === record.id ? null : record.id));
  };

  const handleDelete = async (id: number) => {
    setExpandedId(null);
    onDeleteItem(id);
    try {
      await deleteWorkRecord(id);
    } catch {
      onRefetch();
      showError("삭제 실패", "삭제에 실패했습니다.");
    }
  };

  const handleEdit = (record: WorkRecord) => {
    setExpandedId(null);
    setEditingRecord(record);
  };

  const handleEditSuccess = () => {
    setEditingRecord(null);
    onRefetch();
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
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </View>
      )}

      <EmployerEditWorkModal
        visible={editingRecord !== null}
        onClose={() => setEditingRecord(null)}
        record={editingRecord}
        onSuccess={handleEditSuccess}
      />
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
