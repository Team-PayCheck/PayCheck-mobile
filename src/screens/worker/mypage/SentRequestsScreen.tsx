import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import SentRequestCard from "../../../components/mypage/sentRequests/SentRequestCard";
import { colors } from "../../../constants/colors";
import { useGetCorrectionRequests } from "../../../hooks/worker/useGetCorrectionRequests";
import type { CorrectionStatus } from "../../../api/worker/types";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";

type Props = NativeStackScreenProps<WorkerStackParamList, "SentRequests">;

const FILTER_OPTIONS: { label: string; value: CorrectionStatus | null }[] = [
  { label: "전체", value: null },
  { label: "대기", value: "PENDING" },
  { label: "승인", value: "APPROVED" },
  { label: "거절", value: "REJECTED" },
];

const SentRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

  const {
    requests,
    isLoading,
    statusFilter,
    setStatusFilter,
    expandedId,
    detail,
    isDetailLoading,
    toggleExpand,
    isDeleting,
    handleDelete,
  } = useGetCorrectionRequests();

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />

      <View style={styles.headerSection}>
        <HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "WorkerHomeMain" }] })} />
        <Text weight="ExtraBold" style={styles.title}>보낸 근무요청 보기</Text>

        {/* 필터 탭 */}
        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map((opt) => {
            const isActive = statusFilter === opt.value;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setStatusFilter(opt.value)}
                activeOpacity={0.7}
              >
                <Text
                  weight={isActive ? "Bold" : "Medium"}
                  style={[styles.filterChipText, isActive && styles.filterChipTextActive]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text weight="Medium" style={styles.emptyText}>보낸 근무 요청이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SentRequestCard
              request={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
              detail={expandedId === item.id ? detail : null}
              isDetailLoading={expandedId === item.id && isDetailLoading}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          )}
        />
      )}


      <MyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
        onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
        onPressSentRequests={() => closeDrawer()}
        onPressAccountSettings={() => {
          setIsDrawerVisible(false);
          setTimeout(() => setIsAccountSheetVisible(true), 220);
        }}
        onPressLogout={handleLogout}
        onPressWithdraw={() => navigateFromDrawer("Withdraw")}
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
  headerSection: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 4,
    fontSize: 24,
    color: colors.textPrimary,
    lineHeight: 52,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundGrey,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});

export default SentRequestsScreen;
