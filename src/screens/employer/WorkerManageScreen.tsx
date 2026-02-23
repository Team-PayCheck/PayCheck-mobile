import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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
import type { Workplace } from "../../api/employer/types";
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

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  const handleWorkplaceChange = (workplace: Workplace) => {
    setSelectedWorkplace(workplace);
    setSelectedFilterId("all");
  };

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
        onSelect={setSelectedFilterId}
      />
      {/* TODO: 4단계 - WorkerCard 목록 */}
      <View style={styles.content} />
      <EmployerNavigationBar activeTab="worker" onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default WorkerManageScreen;
