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
import EmployerMyPageDrawer from "../../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import ReceivedRequestCard from "../../../components/employer/mypage/ReceivedRequestCard";
import Pagination from "../../../components/common/Pagination";
import WorkplaceTabSelector from "../../../components/worker/salary/WorkplaceTabSelector";
import type { EmployerStackParamList } from "../../../navigation/EmployerStack";
import type { CorrectionRequestStatus } from "../../../api/employer/types";
import { colors } from "../../../constants/colors";
import { useEmployerDrawer } from "../../../hooks/employer/useEmployerDrawer";
import { useReceivedRequests } from "../../../hooks/employer/useReceivedRequests";

type Props = NativeStackScreenProps<EmployerStackParamList, "EmployerReceivedRequests">;

const FILTER_OPTIONS: { label: string; value: CorrectionRequestStatus | null }[] = [
	{ label: "전체", value: null },
	{ label: "대기", value: "PENDING" },
	{ label: "승인", value: "APPROVED" },
	{ label: "거절", value: "REJECTED" },
];

const EmployerReceivedRequestsScreen: React.FC<Props> = ({ navigation }) => {
	const { openDrawer, drawerProps, accountSheetProps } = useEmployerDrawer(navigation, "EmployerReceivedRequests");

	const {
		workplaces,
		isWorkplacesLoading,
		selectedWorkplaceId,
		setSelectedWorkplaceId,

		statusFilter,
		setStatusFilter,

		requests,
		isLoading,
		currentPage,
		totalPages,
		setCurrentPage,

		expandedId,
		detail,
		isDetailLoading,
		toggleExpand,

		processingId,
		processingAction,
		handleApprove,
		handleReject,
	} = useReceivedRequests();

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={openDrawer} />

			<View style={styles.headerSection}>
				<HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "EmployerHomeMain" }] })} />
				<Text weight="ExtraBold" style={styles.title}>받은 근무요청 보기</Text>

				{/* 사업장 선택 탭 */}
				{isWorkplacesLoading ? (
					<ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: 12 }} />
				) : workplaces.length > 0 ? (
					<View style={styles.workplaceTabWrap}>
						<WorkplaceTabSelector
							workplaceNames={workplaces.map((wp) => wp.name)}
							selectedIndex={workplaces.findIndex((wp) => wp.id === selectedWorkplaceId)}
							onSelect={(index) => {
								const wp = workplaces[index];
								if (wp) setSelectedWorkplaceId(wp.id);
							}}
						/>
					</View>
				) : null}

				{/* 상태 필터 탭 */}
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
			) : !selectedWorkplaceId ? (
				<View style={styles.emptyContainer}>
					<Text weight="Medium" style={styles.emptyText}>등록된 사업장이 없습니다.</Text>
				</View>
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
							isProcessing={processingId === item.id ? processingAction || false : false}
						/>
					)}
				/>
			)}

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
				alwaysShow
			/>

			<EmployerMyPageDrawer {...drawerProps} />
			<BottomSheetModal {...accountSheetProps}>
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
		marginBottom: 12,
	},
	// 사업장 탭
	workplaceTabWrap: {
		marginBottom: 14,
	},
	// 상태 필터
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
	// 리스트
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
