import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import BottomSheetModal from "../../common/BottomSheetModal";
import { colors } from "../../../constants/colors";
import type { Workplace } from "../../../api/employer/types";

interface WorkerManageHeaderProps {
  selectedWorkplace: Workplace;
  workplaces: Workplace[];
  onWorkplaceChange: (workplace: Workplace) => void;
  onAddWorker: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

const WorkerManageHeader: React.FC<WorkerManageHeaderProps> = ({
  selectedWorkplace,
  workplaces,
  onWorkplaceChange,
  onAddWorker,
  onMenuPress,
  onNotificationPress,
}) => {
  const [workplaceModalVisible, setWorkplaceModalVisible] = useState(false);

  const handleWorkplaceSelect = (workplace: Workplace) => {
    onWorkplaceChange(workplace);
    setWorkplaceModalVisible(false);
  };

  return (
    <>
      {/* 상단 아이콘 행 */}
      <View style={styles.iconRow}>
        <TouchableOpacity onPress={onMenuPress} activeOpacity={0.8}>
          <Feather name="align-left" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationPress} activeOpacity={0.8}>
          <Ionicons
            name="notifications-outline"
            size={28}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

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
                  {workplace.workerCount}명
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
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
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
