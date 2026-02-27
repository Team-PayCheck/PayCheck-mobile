import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import EmployerMyPageDrawer from "../../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import { ProfileImagePicker } from "../../../components/signup";
import ProfileEditModal from "../../../components/mypage/ProfileEditModal";
import type { EmployerStackParamList } from "../../../navigation/EmployerStack";
import { colors } from "../../../constants/colors";
import { getUserProfile } from "../../../api/user";
import type { UserResponse } from "../../../api/user/types";
import { useEmployerDrawer } from "../../../hooks/employer/useEmployerDrawer";

type Props = NativeStackScreenProps<EmployerStackParamList, "EmployerProfileEdit">;

const EmployerProfileEditScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileEditVisible, setIsProfileEditVisible] = useState(false);
  const { openDrawer, drawerProps, accountSheetProps } = useEmployerDrawer(navigation, "EmployerProfileEdit");

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getUserProfile();
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch {
      // 에러 무시
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const profileImageUri = user?.profileImageUrl ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={openDrawer} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "EmployerHomeMain" }] })} />
          <Text weight="ExtraBold" style={styles.title}>내 프로필 수정</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.sectionsArea}>
            <View style={styles.card}>
              <View style={styles.profileSection}>
                <ProfileImagePicker imageUri={profileImageUri} onPress={() => {}} showCameraIcon={false} />
              </View>
              <View style={styles.fieldGroup}>
                <InfoRow label="이름" value={user?.name ?? "-"} />
                <InfoRow label="전화번호" value={user?.phone || "-"} />
              </View>
              <TouchableOpacity style={styles.sectionButton} activeOpacity={0.8} onPress={() => setIsProfileEditVisible(true)}>
                <Text weight="SemiBold" style={styles.sectionButtonText}>프로필 수정하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <EmployerMyPageDrawer {...drawerProps} />
      <BottomSheetModal {...accountSheetProps}>
        <AccountTermsContent />
      </BottomSheetModal>

      <ProfileEditModal
        visible={isProfileEditVisible}
        onClose={() => setIsProfileEditVisible(false)}
        user={user ? { ...user, phone: user.phone ?? "-" } : null}
        onSuccess={fetchUser}
      />
    </SafeAreaView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text weight="Medium" style={styles.infoLabel}>{label}</Text>
    <Text weight="Medium" style={styles.infoValue}>{value}</Text>
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
    paddingTop: 10,
    marginBottom: 12,
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 52,
  },
  sectionsArea: {
    gap: 16,
  },
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
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 12,
  },
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

export default EmployerProfileEditScreen;
