import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import WorkplaceCard from "../../../components/mypage/workplaceManage/WorkplaceCard";
import { getContracts } from "../../../api/worker";
import type { ContractListItem } from "../../../api/worker/types";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";


type Props = NativeStackScreenProps<WorkerStackParamList, "WorkplaceManage">;

{/* 현재 API 연동 테스트 불가
	: 로그인된 계정이 고용주(EMPLOYER)로 등록되어 있어
	  worker 전용 API 호출 시 서버에서 500 에러 발생-> 근로자 계정 필요 */}

const EmployerWorkplaceManageScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [workplaces, setWorkplaces] = useState<ContractListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	// 컴포넌트 마운트 시 근무지(계약) 정보 fetch
	useEffect(() => {
		const fetchContracts = async () => {
			setLoading(true);
			setError(null);
			try {
					// 실제 API 호출
					const res = await getContracts();
					if (res.success && Array.isArray(res.data)) {
						setWorkplaces(res.data);
					} else {
						setWorkplaces([]);
						setError(res.error?.message || '근무지 정보를 불러오지 못했습니다.');
					}
				} catch (e: any) {
					setWorkplaces([]);
					setError(e?.message || '근무지 정보를 불러오지 못했습니다.');
				} finally {
					setLoading(false);
				}
		};
		fetchContracts();
	}, []);

	// WorkplaceCard에 맞는 데이터 변환 및 렌더링
	const renderWorkplaceCards = () => {
		if (!workplaces || workplaces.length === 0) return (
			<Text style={{textAlign: 'center', marginTop: 24}}>근무지 정보가 없습니다.</Text>
		);
		return workplaces.map((w, idx) => (
			<WorkplaceCard
				key={w.id || idx}
				name={w.workplaceName || '-'}
				joinedAt={w.contractStartDate ? formatDate(w.contractStartDate) : '-'}
				wage={w.hourlyWage ? `${formatCurrency(w.hourlyWage)}원` : '-'}
			/>
		));
	};

	// 날짜 포맷: YYYY-MM-DD → YYYY년 M월 D일로 변환
	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.scrollContent}>
				<View style={styles.headerRow}>
					<View style={{ flex: 1 }}>
						<HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "WorkerHomeMain" }] })} />
						<Text weight="ExtraBold" style={styles.title}>내 근무지</Text>
					</View>
					<View style={styles.illustWrapper}>
						<Image
							source={require("../../../assets/images/mypage/location.png")}
							style={styles.illust}
							resizeMode="contain"
						/>
					</View>
				</View>
				<View style={styles.cardList}>
					{loading ? (
						<ActivityIndicator size="large" color={colors.textSecondary} style={{marginTop: 32}} />
					) : error ? (
						<Text style={{color: 'red', textAlign: 'center', marginTop: 24}}>{error}</Text>
					) : (
						renderWorkplaceCards()
					)}
				</View>
			</View>
			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => closeDrawer()}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
				onPressNotificationSettings={() => navigateFromDrawer("NotificationSettings")}
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
	cardList: {
		marginTop: 8,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		shadowColor: colors.black,
		shadowOpacity: 0.07,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 8,
		elevation: 3,
		marginBottom: 16,
	},
	cardLabel: {
		fontSize: 16,
		color: colors.textSecondary,
		marginBottom: 6,
	},
	cardValue: {
		color: colors.textPrimary,
	},
});

export default EmployerWorkplaceManageScreen;
