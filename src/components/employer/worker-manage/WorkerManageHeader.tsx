import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import type { WorkplaceDetails } from "../../../api/employer/types";

interface WorkerManageHeaderProps {
  selectedWorkplace: WorkplaceDetails;
  workplaces: WorkplaceDetails[];
  onWorkplaceChange: (workplace: WorkplaceDetails) => void;
  onAddWorker?: () => void;
}

const WorkerManageHeader: React.FC<WorkerManageHeaderProps> = ({
  selectedWorkplace,
  workplaces,
  onWorkplaceChange,
  onAddWorker,
}) => {
  const [workplaceModalVisible, setWorkplaceModalVisible] = useState(false);

  const handleWorkplaceSelect = (workplace: WorkplaceDetails) => {
    onWorkplaceChange(workplace);
    setWorkplaceModalVisible(false);
  };

  return (
    <>
      {/* 근무지 드롭다운 + 근무자 추가 행 */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.workplaceDropdown}
          onPress={() => setWorkplaceModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text weight="Bold" style={styles.workplaceName}>
            {selectedWorkplace.name}
          </Text>
          <Feather name="chevron-down" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        {onAddWorker && (
          <TouchableOpacity
            style={styles.addWorkerButton}
            onPress={onAddWorker}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={14} color={colors.primary} />
            <Text weight="Medium" style={styles.addWorkerText}>
              근무자 추가
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 근무지 선택 모달 */}
      <BottomSheetModal
        visible={workplaceModalVisible}
        onClose={() => setWorkplaceModalVisible(false)}
        maxHeight="50%"
      >
        <Text weight="SemiBold" style={styles.modalTitle}>
          근무지 선택
        </Text>
        <ScrollView>
          {workplaces.map((workplace) => {
            const isSelected = workplace.id === selectedWorkplace.id;
            return (
              <TouchableOpacity
                key={workplace.id}
                style={[
                  styles.workplaceItem,
                  isSelected && styles.workplaceItemSelected,
                ]}
                onPress={() => handleWorkplaceSelect(workplace)}
                activeOpacity={0.7}
              >
                <Text
                  weight={isSelected ? "SemiBold" : "Regular"}
                  style={[
                    styles.workplaceItemText,
                    isSelected && styles.workplaceItemTextSelected,
                  ]}
                >
                  {workplace.name}
                </Text>
                <Text style={styles.workerCountText}>
                  {workplace.workerCount ?? 0}명
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  workplaceDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workplaceName: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  addWorkerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addWorkerText: {
    fontSize: 14,
    color: colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  workplaceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  workplaceItemSelected: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: -8,
  },
  workplaceItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  workplaceItemTextSelected: {
    color: colors.primary,
  },
  workerCountText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default WorkerManageHeader;
