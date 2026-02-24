import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const WorkerManageScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text weight="Bold" style={styles.title}>
          직원관리
        </Text>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: colors.textPrimary,
  },
});

export default WorkerManageScreen;
