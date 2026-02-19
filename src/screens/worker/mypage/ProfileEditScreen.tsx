import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import ProfileFieldRow from "../../../components/mypage/profileEdit/ProfileFieldRow";
import ProfilePhoto from "../../../components/mypage/profileEdit/ProfilePhoto";
import BankSelectModal from "../../../components/signup/BankSelectModal";
import { TouchableOpacity } from "react-native";
import { colors } from "../../../constants/colors";
import { useWorkerData } from "../../../hooks/worker/useUserData";


type Props = NativeStackScreenProps<WorkerStackParamList, "ProfileEdit">;


const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const { user, worker, isLoading } = useWorkerData();

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  const handleBankSelect = (selectedBank: string) => {
    setIsBankModalVisible(false);
  };
  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const { useLogoutHandler } = require("../../../hooks/common/useLogoutHandler");
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  const profileImageSource = user?.profileImageUrl
    ? { uri: user.profileImageUrl }
    : require("../../../assets/images/mypage/basicProfileImage.png");

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
            <Text weight="ExtraBold" style={styles.title}>내 프로필 수정</Text>
          </View>
          <View style={styles.illustWrapper}>
            <Image
              source={require("../../../assets/images/mypage/user.png")}
              style={styles.illust}
              resizeMode="contain"
            />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.formArea}>
            <View style={styles.nameRow}>
              <ProfilePhoto imageSource={profileImageSource} />
              <ProfileFieldRow
                label=""
                value={user?.name ?? ""}
                editable={false}
                placeholder="이름"
                containerStyle={{ flex: 1 }}
                inputStyle={{ marginLeft: 10 }}
              />
            </View>
            <ProfileFieldRow
              label="전화 번호"
              value={user?.phone ?? ""}
              editable={false}
              placeholder="전화 번호"
              keyboardType="phone-pad"
            />
            <ProfileFieldRow
              label="근무자코드"
              value={worker?.workerCode ?? ""}
              editable={false}
              placeholder="근무자코드"
              inputStyle={{ color: colors.textSecondary }}
            />
            <View style={{ gap: 14 }}>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel} weight="Medium">은행</Text>
                <TouchableOpacity
                  style={styles.bankSelector}
                  activeOpacity={0.8}
                  onPress={() => setIsBankModalVisible(true)}
                >
                  <Text weight="Medium" style={styles.bankText}>{worker?.bankName ?? "-"}</Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel} weight="Medium">계좌번호</Text>
                  <View>
                  <TextInput
                    value={worker?.accountNumber ?? ""}
                    editable={false}
                    style={styles.input}
                    placeholder="계좌번호"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                  />
                </View>
                <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
                  <Text weight="Medium" style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <BankSelectModal
        visible={isBankModalVisible}
        onClose={() => setIsBankModalVisible(false)}
        onSelect={handleBankSelect}
        selectedBank={worker?.bankName ?? ""}
      />
      <MyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => closeDrawer()}
        onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
        onPressSentRequests={() => navigateFromDrawer("SentRequests")}
        onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
        onPressLogout={handleLogout}
        onPressWithdraw={() => navigateFromDrawer("Withdraw")}
      />
    </SafeAreaView>
	);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 10,
    marginBottom: 12,
  },
  illustWrapper: {
    width: 100,
    height: 100,
    marginTop: -8,
    marginRight: -8,
  },
  illust: {
    width: "100%",
    height: "100%",
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 52,
  },
  formArea: {
    marginTop: 8,
    gap: 14,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  fieldLabel: {
    width: 68,
    fontSize: 15,
    color: colors.textSecondary,
  },
  editButton: {
    width: 42,
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bankSelector: {
    width: 120,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundGrey,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bankText: {
    fontSize: 15,
    color: colors.textSecondary,
	marginRight: 4,
  },
  input: {
    height: 40,
    backgroundColor: colors.backgroundGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: "Pretendard-Medium",
  },
});

export default ProfileEditScreen;
