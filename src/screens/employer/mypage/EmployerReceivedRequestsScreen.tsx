import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import EmployerMyPageDrawer from "../../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import ReceivedRequestCard from "../../../components/employer/mypage/ReceivedRequestCard";
import type { EmployerStackParamList } from "../../../navigation/EmployerStack";
import type {
  CorrectionRequestListItem,
  CorrectionRequestDetail,
  CorrectionRequestStatus,
} from "../../../api/employer/types";
import { colors } from "../../../constants/colors";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";

type Props = NativeStackScreenProps<EmployerStackParamList, "EmployerReceivedRequests">;

const FILTER_OPTIONS: { label: string; value: CorrectionRequestStatus | null }[] = [
  { label: "전체", value: null },
  { label: "대기", value: "PENDING" },
  { label: "승인", value: "APPROVED" },
  { label: "거절", value: "REJECTED" },
];

// ===== 더미 데이터 (API 연동 전 UI 테스트용) =====
const DUMMY_REQUESTS: CorrectionRequestListItem[] = [
  {
    id: 1,
    type: "UPDATE",
    workRecordId: 42,
    workDate: "2026-02-20",
    originalStartTime: "09:00",
    originalEndTime: "18:00",
    requestedStartTime: "10:00",
    requestedEndTime: "19:00",
    status: "PENDING",
    requester: { id: 5, name: "홍길동" },
    workplaceName: "카페 알바",
    createdAt: "2026-02-21T14:30:00",
  },
  {
    id: 2,
    type: "CREATE",
    workRecordId: null,
    workDate: "2026-02-22",
    originalStartTime: null,
    originalEndTime: null,
    requestedStartTime: "08:00",
    requestedEndTime: "17:00",
    status: "APPROVED",
    requester: { id: 6, name: "김철수" },
    workplaceName: "카페 알바",
    createdAt: "2026-02-22T09:00:00",
  },
  {
    id: 3,
    type: "DELETE",
    workRecordId: 55,
    workDate: "2026-02-19",
    originalStartTime: "10:00",
    originalEndTime: "19:00",
    requestedStartTime: "10:00",
    requestedEndTime: "19:00",
    status: "REJECTED",
    requester: { id: 5, name: "홍길동" },
    workplaceName: "카페 알바",
    createdAt: "2026-02-20T11:00:00",
  },
];

const DUMMY_DETAIL: CorrectionRequestDetail = {
  id: 1,
  type: "UPDATE",
  workRecordId: 42,
  contractId: 10,
  originalWorkDate: "2026-02-20",
  originalStartTime: "09:00",
  originalEndTime: "18:00",
  requestedWorkDate: "2026-02-20",
  requestedStartTime: "10:00",
  requestedEndTime: "19:00",
  requestedBreakMinutes: 60,
  requestedMemo: "출근 시간 변경 요청합니다.",
  status: "PENDING",
  requester: { id: 5, name: "홍길동" },
  reviewedAt: null,
  createdAt: "2026-02-21T14:30:00",
};
// ===== 더미 데이터 끝 =====

const EmployerReceivedRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

  const closeDrawer = () => setIsDrawerVisible(false);
  const navigateFromDrawer = (route: keyof EmployerStackParamList) => {
    closeDrawer();
    navigation.navigate(route);
  };
  const handleLogout = useLogoutHandler(closeDrawer, navigation);

  // 상태 (추후 훅으로 분리)
  const [statusFilter, setStatusFilter] = useState<CorrectionRequestStatus | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoading = false; // 더미

  // 필터링
  const requests = statusFilter
    ? DUMMY_REQUESTS.filter((r) => r.status === statusFilter)
    : DUMMY_REQUESTS;

  // 상세 (더미)
  const detail: CorrectionRequestDetail | null = expandedId ? DUMMY_DETAIL : null;
  const isDetailLoading = false;

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleApprove = (id: number) => {
    Alert.alert("승인", `요청 #${id}을 승인하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "승인",
        onPress: () => {
          setIsProcessing(true);
          // TODO: API 연동
          setTimeout(() => {
            setIsProcessing(false);
            setExpandedId(null);
            Alert.alert("완료", "요청이 승인되었습니다.");
          }, 500);
        },
      },
    ]);
  };

  const handleReject = (id: number) => {
    Alert.alert("거절", `요청 #${id}을 거절하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "거절",
        style: "destructive",
        onPress: () => {
          setIsProcessing(true);
          // TODO: API 연동
          setTimeout(() => {
            setIsProcessing(false);
            setExpandedId(null);
            Alert.alert("완료", "요청이 거절되었습니다.");
          }, 500);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => setIsDrawerVisible(true)} />

      <View style={styles.headerSection}>
        <HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "EmployerHomeMain" }] })} />
        <Text weight="ExtraBold" style={styles.title}>받은 근무요청 보기</Text>

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
          <Text weight="Medium" style={styles.emptyText}>받은 근무 요청이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ReceivedRequestCard
              request={item}
              expanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
              detail={expandedId === item.id ? detail : null}
              isDetailLoading={expandedId === item.id && isDetailLoading}
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={isProcessing}
            />
          )}
        />
      )}

      <EmployerMyPageDrawer
        visible={isDrawerVisible}
        onClose={closeDrawer}
        onPressProfileEdit={() => navigateFromDrawer("EmployerProfileEdit")}
        onPressWorkplaceManage={() => navigateFromDrawer("EmployerWorkplaceManage")}
        onPressReceivedRequests={() => closeDrawer()}
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

export default EmployerReceivedRequestsScreen;
