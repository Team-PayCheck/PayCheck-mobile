import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Image, TextInput } from "react-native";
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


type Props = NativeStackScreenProps<WorkerStackParamList, "ProfileEdit">;


const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("김나현");
  const [phone, setPhone] = useState("010-5156-1565");
  const [email, setEmail] = useState("abc@naver.com");
  const [workerCode] = useState("dfae45");
  const [bank, setBank] = useState("하나은행");
  const [accountNumber, setAccountNumber] = useState("777-7777-7777-7777");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  const handleBankSelect = (selectedBank: string) => {
    setBank(selectedBank);
    setIsBankModalVisible(false);
  };
  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const { useLogoutHandler } = require("../../../hooks/common/useLogoutHandler");
  const handleLogout = useLogoutHandler(closeDrawer);

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
          <View style={styles.titleRow}>
            <Text weight="ExtraBold" style={styles.title}>내 프로필 수정</Text>
            <Image
              source={require("../../../assets/images/mypage/user.png")}
              style={styles.titleImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.formArea}>
          <View style={styles.nameRow}>
            <ProfilePhoto imageSource={require("../../../assets/images/mypage/user.png")}/>
            <ProfileFieldRow
              label=""
              value={name}
              onChangeText={setName}
              placeholder="이름"
              onEdit={() => {}}
              containerStyle={{ flex: 1 }}
              inputStyle={{ marginLeft: 10 }}
            />
          </View>
          <ProfileFieldRow
            label="전화 번호"
            value={phone}
            onChangeText={setPhone}
            placeholder="전화 번호"
            keyboardType="phone-pad"
            onEdit={() => {}}
          />
          <ProfileFieldRow
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일"
            keyboardType="email-address"
            onEdit={() => {}}
          />
          <ProfileFieldRow
            label="근무자코드"
            value={workerCode}
            editable={false}
            placeholder="근무자코드"
            onEdit={() => {}}
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
                <Text weight="Medium" style={styles.bankText}>{bank}</Text>
                <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel} weight="Medium">계좌번호</Text>
                <View>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
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
      </ScrollView>
      <BankSelectModal
        visible={isBankModalVisible}
        onClose={() => setIsBankModalVisible(false)}
        onSelect={handleBankSelect}
        selectedBank={bank}
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
  headerArea: {
    paddingTop: 8,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 52,
  },
  titleImage: {
    width: 100,
    height: 100,
    marginTop: -2,
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
    width: 88,
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
