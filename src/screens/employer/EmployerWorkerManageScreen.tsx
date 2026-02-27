import React, { useState } from "react";
import { StyleSheet, FlatList, ActivityIndicator, View, Alert } from "react-native";
import { Text } from "../../components/common/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../constants/colors";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import Header from "../../components/layout/Header";
import EmployerMyPageDrawer from "../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import AccountTermsContent from "../../components/mypage/AccountTermsContent";
import { useEmployerDrawer } from "../../hooks/employer/useEmployerDrawer";
import WorkerManageHeader from "../../components/employer/worker-manage/WorkerManageHeader";
import WorkerFilterTabs, {
  type WorkerFilterId,
} from "../../components/employer/worker-manage/WorkerFilterTabs";
import WorkerCard from "../../components/employer/worker-manage/WorkerCard";
import AddWorkerModal from "../../components/employer/worker-manage/AddWorkerModal";
import type { ContractUpdateRequest } from "../../types/employer/employer.types";
import type { WorkplaceDetails } from "../../api/employer/types";
import { useWorkplaceManagement } from "../../hooks/employer/useWorkplaceManagement";
import useWorkplaceContracts from "../../hooks/employer/useWorkplaceContracts";


const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const EmployerWorkerManageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();
  const { openDrawer, drawerProps, accountSheetProps } = useEmployerDrawer(navigation);

  const {
    workplaces,
    isLoading: isWorkplacesLoading,
    selectedWorkplaceId,
    setSelectedWorkplaceId,
  } = useWorkplaceManagement();

  const { workers, isLoading: isWorkersLoading, resignWorker, updateWorker, addWorker } = useWorkplaceContracts(selectedWorkplaceId);

  const selectedWorkplace = workplaces.find((wp) => wp.id === selectedWorkplaceId) ?? null;

  const [selectedFilterId, setSelectedFilterId] =
    useState<WorkerFilterId>("all");
  const [expandedContractId, setExpandedContractId] = useState<number | null>(
    null
  );
  const [addWorkerVisible, setAddWorkerVisible] = useState(false);

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  const handleWorkplaceChange = (workplace: WorkplaceDetails) => {
    setSelectedWorkplaceId(workplace.id);
    setSelectedFilterId("all");
    setExpandedContractId(null);
  };

  const handleFilterSelect = (id: WorkerFilterId) => {
    setSelectedFilterId(id);
    if (id !== "all") {
      setExpandedContractId(id as number);
    } else {
      setExpandedContractId(null);
    }
  };

  const handleCardToggle = (contractId: number) => {
    setExpandedContractId((prev) =>
      prev === contractId ? null : contractId
    );
  };

  const handleUpdate = async (
    contractId: number,
    data: ContractUpdateRequest
  ) => {
    try {
      await updateWorker(contractId, data);
      setExpandedContractId(null);
      Alert.alert("수정 완료", "근무자 정보가 수정되었습니다.");
    } catch {
      Alert.alert("수정 실패", "근무자 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleResign = async (contractId: number) => {
    try {
      await resignWorker(contractId);
      setExpandedContractId(null);
      if (selectedFilterId !== "all") {
        setSelectedFilterId("all");
      }
    } catch {
      Alert.alert("퇴사 처리 실패", "퇴사 처리 중 오류가 발생했습니다.");
    }
  };

  const filteredWorkers =
    selectedFilterId === "all"
      ? workers
      : workers.filter((w) => w.contractId === selectedFilterId);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onPressLeft={openDrawer} />
      {isWorkplacesLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : workplaces.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>등록된 근무지가 없습니다.</Text>
        </View>
      ) : isWorkersLoading || selectedWorkplace === null ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <WorkerManageHeader
            selectedWorkplace={selectedWorkplace}
            workplaces={workplaces}
            onWorkplaceChange={handleWorkplaceChange}
            onAddWorker={() => setAddWorkerVisible(true)}
          />
          <WorkerFilterTabs
            workers={workers}
            selectedId={selectedFilterId}
            onSelect={handleFilterSelect}
          />
          <FlatList
            data={filteredWorkers}
            keyExtractor={(item) => item.contractId.toString()}
            renderItem={({ item }) => (
              <WorkerCard
                worker={item}
                isExpanded={expandedContractId === item.contractId}
                onToggle={() => handleCardToggle(item.contractId)}
                onUpdate={handleUpdate}
                onResign={handleResign}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
      <EmployerNavigationBar activeTab="worker" onTabPress={handleTabPress} />
      {selectedWorkplace && (
        <AddWorkerModal
          visible={addWorkerVisible}
          onClose={() => setAddWorkerVisible(false)}
          workplaceId={selectedWorkplace.id}
          workplaceName={selectedWorkplace.name}
          onSuccess={async (contractId) => {
            setAddWorkerVisible(false);
            await addWorker(contractId);
          }}
        />
      )}

      <EmployerMyPageDrawer {...drawerProps} />
      <BottomSheetModal {...accountSheetProps}>
        <AccountTermsContent />
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});

export default EmployerWorkerManageScreen;
