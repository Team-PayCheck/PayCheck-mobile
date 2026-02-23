import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import type { EmployerWorkerContract } from "../../../api/employer/types";

/** "all" = 전체 탭, 그 외는 contractId */
export type WorkerFilterId = "all" | number;

interface WorkerFilterTabsProps {
  workers: EmployerWorkerContract[];
  selectedId: WorkerFilterId;
  onSelect: (id: WorkerFilterId) => void;
}

const WorkerFilterTabs: React.FC<WorkerFilterTabsProps> = ({
  workers,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* 전체 탭 */}
        <TouchableOpacity
          style={[styles.chip, selectedId === "all" && styles.chipSelected]}
          onPress={() => onSelect("all")}
          activeOpacity={0.7}
        >
          <Text
            weight={selectedId === "all" ? "SemiBold" : "Regular"}
            style={[
              styles.chipText,
              selectedId === "all" && styles.chipTextSelected,
            ]}
          >
            전체 {workers.length}
          </Text>
        </TouchableOpacity>

        {/* 근무자별 탭 */}
        {workers.map((worker) => {
          const isSelected = selectedId === worker.contractId;
          return (
            <TouchableOpacity
              key={worker.contractId}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(worker.contractId)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.white,
  },
});

export default WorkerFilterTabs;
