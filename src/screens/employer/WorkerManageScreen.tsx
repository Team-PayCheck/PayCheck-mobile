import React, { useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../constants/colors";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import WorkerManageHeader from "../../components/employer/worker-manage/WorkerManageHeader";
import WorkerFilterTabs, {
  type WorkerFilterId,
} from "../../components/employer/worker-manage/WorkerFilterTabs";
import WorkerCard from "../../components/employer/worker-manage/WorkerCard";
import type {
  Workplace,
  EmployerWorkerContract,
  ContractUpdateRequest,
} from "../../api/employer/types";
import {
  DUMMY_WORKPLACES,
  DUMMY_WORKERS,
} from "../../dummyData/employerWorkerManage";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const WorkerManageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();

  const [selectedWorkplace, setSelectedWorkplace] = useState<Workplace>(
    DUMMY_WORKPLACES[0]
  );
  const [selectedFilterId, setSelectedFilterId] =
    useState<WorkerFilterId>("all");
  const [expandedContractId, setExpandedContractId] = useState<number | null>(
    null
  );

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  const handleWorkplaceChange = (workplace: Workplace) => {
    setSelectedWorkplace(workplace);
    setSelectedFilterId("all");
    setExpandedContractId(null);
  };

  const handleFilterSelect = (id: WorkerFilterId) => {
    setSelectedFilterId(id);
    // 특정 근무자 탭 선택 시 해당 카드 자동 펼침
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

  const handleUpdate = (
    contractId: number,
    data: ContractUpdateRequest
  ) => {
    // TODO: API 연동
    console.log("update", contractId, data);
  };

  const handleResign = (contractId: number) => {
    // TODO: API 연동
    console.log("resign", contractId);
  };

  const handleOpenCalendar = (worker: EmployerWorkerContract) => {
    // TODO: 5단계 - 근무 달력 모달 열기
    console.log("calendar", worker.workerName);
  };

  // 필터 적용: "all"이면 전체, 특정 id면 해당 근무자만
  const filteredWorkers =
    selectedFilterId === "all"
      ? DUMMY_WORKERS
      : DUMMY_WORKERS.filter((w) => w.contractId === selectedFilterId);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <WorkerManageHeader
        selectedWorkplace={selectedWorkplace}
        workplaces={DUMMY_WORKPLACES}
        onWorkplaceChange={handleWorkplaceChange}
        onAddWorker={() => {}}
      />
      <WorkerFilterTabs
        workers={DUMMY_WORKERS}
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
            onOpenCalendar={handleOpenCalendar}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <EmployerNavigationBar activeTab="worker" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGrey,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
});

export default WorkerManageScreen;
