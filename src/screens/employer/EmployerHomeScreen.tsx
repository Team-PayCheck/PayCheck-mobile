import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
import Header from "../../components/layout/Header";
import EmployerNavigationBar, {
  type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import EmployerMyPageDrawer from "../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import AccountTermsContent from "../../components/mypage/AccountTermsContent";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import { useLogoutHandler } from "../../hooks/common/useLogoutHandler";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
  home: "EmployerHomeMain",
  worker: "WorkerManage",
  transfer: "RemittanceManage",
};

const EmployerHomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof EmployerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  const handleTabPress = (tab: EmployerTabName) => {
    navigation.replace(TAB_SCREEN_MAP[tab]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      <View style={styles.content}>
        <Text weight="Bold" style={styles.title}>
          고용주홈
        </Text>
      </View>
      <EmployerNavigationBar activeTab="home" onTabPress={handleTabPress} />

      <EmployerMyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => navigateFromDrawer("EmployerProfileEdit")}
        onPressWorkplaceManage={() => navigateFromDrawer("EmployerWorkplaceManage")}
        onPressReceivedRequests={() => navigateFromDrawer("EmployerReceivedRequests")}
        onPressAccountSettings={() => {
          setIsDrawerVisible(false);
          setTimeout(() => setIsAccountSheetVisible(true), 220);
        }}
        onPressLogout={handleLogout}
        onPressWithdraw={() => navigateFromDrawer("EmployerWithdraw")}
      />

      <BottomSheetModal
        visible={isAccountSheetVisible}
        onClose={() => setIsAccountSheetVisible(false)}
      >
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

export default EmployerHomeScreen;
