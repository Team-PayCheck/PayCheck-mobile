import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import EmployerMyPageDrawer from "../../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import type { EmployerStackParamList } from "../../../navigation/EmployerStack";
import { colors } from "../../../constants/colors";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";

type Props = NativeStackScreenProps<EmployerStackParamList, "EmployerProfileEdit">;

const EmployerProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof EmployerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "EmployerHomeMain" }] })} />
          <Text weight="ExtraBold" style={styles.title}>내 프로필 수정</Text>
        </View>

        <View style={styles.placeholder}>
          <Text weight="Medium" style={styles.placeholderText}>프로필 수정 화면 (구현 예정)</Text>
        </View>
      </View>

      <EmployerMyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => closeDrawer()}
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
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    paddingTop: 10,
    marginBottom: 12,
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 52,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});

export default EmployerProfileEditScreen;
