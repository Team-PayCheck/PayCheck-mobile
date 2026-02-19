import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import { ProfileImagePicker } from "../../../components/signup";
import { colors } from "../../../constants/colors";
import { useWorkerData } from "../../../hooks/worker/useUserData";
import ProfileEditModal from "../../../components/mypage/ProfileEditModal";

type Props = NativeStackScreenProps<WorkerStackParamList, "ProfileEdit">;

const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const { user, worker, isLoading, refetch } = useWorkerData();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isProfileEditVisible, setIsProfileEditVisible] = useState(false);

  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const { useLogoutHandler } = require("../../../hooks/common/useLogoutHandler");
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  const profileImageUri = user?.profileImageUrl ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
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
          <View style={styles.sectionsArea}>
            {/* 섹션 1: 프로필 정보 (API 1 - /api/users/me) */}
            <View style={styles.card}>
              <View style={styles.profileSection}>
                <ProfileImagePicker imageUri={profileImageUri} onPress={() => {}} showCameraIcon={false} />
              </View>
              <View style={styles.fieldGroup}>
                <InfoRow label="이름" value={user?.name ?? "-"} />
                <InfoRow label="전화번호" value={user?.phone ?? "-"} />
              </View>
              <TouchableOpacity style={styles.sectionButton} activeOpacity={0.8} onPress={() => setIsProfileEditVisible(true)}>
                <Text weight="SemiBold" style={styles.sectionButtonText}>프로필 수정하기</Text>
              </TouchableOpacity>
            </View>

            {/* 섹션 2: 근무 정보 (수정 불가) */}
            <View style={styles.readOnlyCard}>
              <View style={styles.readOnlyHeader}>
                <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
                <Text weight="Medium" style={styles.readOnlyLabel}>근무 정보</Text>
              </View>
              <InfoRow label="근무자코드" value={worker?.workerCode ?? "-"} muted />
            </View>

            {/* 섹션 3: 급여 계좌 정보 (API 2 - /api/users/me/account) */}
            <View style={styles.card}>
              <Text weight="SemiBold" style={styles.cardTitle}>급여 계좌</Text>
              <View style={styles.fieldGroup}>
                <InfoRow label="은행" value={worker?.bankName ?? "-"} />
                <InfoRow label="계좌번호" value={worker?.accountNumber ?? "-"} />
              </View>
              <TouchableOpacity style={styles.sectionButton} activeOpacity={0.8}>
                <Text weight="SemiBold" style={styles.sectionButtonText}>계좌 정보 수정하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

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

      <ProfileEditModal
        visible={isProfileEditVisible}
        onClose={() => setIsProfileEditVisible(false)}
        user={user}
        onSuccess={refetch}
      />
    </SafeAreaView>
  );
};

/** 라벨 + 값을 보여주는 행 */
const InfoRow: React.FC<{ label: string; value: string; muted?: boolean }> = ({
  label,
  value,
  muted,
}) => (
  <View style={styles.infoRow}>
    <Text weight="Medium" style={styles.infoLabel}>{label}</Text>
    <Text
      weight="Medium"
      style={[styles.infoValue, muted && styles.infoValueMuted]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
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

  // 섹션 영역
  sectionsArea: {
    gap: 16,
  },

  // 카드 공통
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // 읽기 전용 카드
  readOnlyCard: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  readOnlyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  readOnlyLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },

  // 프로필 사진 섹션
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  // 필드 그룹
  fieldGroup: {
    gap: 12,
  },

  // 정보 행
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundGrey,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoLabel: {
    width: 72,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  infoValueMuted: {
    color: colors.textSecondary,
  },

  // 섹션 버튼
  sectionButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  sectionButtonText: {
    fontSize: 14,
    color: colors.white,
  },
});

export default ProfileEditScreen;
