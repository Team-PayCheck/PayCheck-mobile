import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../constants/colors";
import Header from "../../../components/layout/Header";
import HomeBackButton from "../../../components/common/HomeBackButton";
import EmployerMyPageDrawer from "../../../components/employer/mypage/EmployerMyPageDrawer";
import BottomSheetModal from "../../../components/common/BottomSheetModal";
import AccountTermsContent from "../../../components/mypage/AccountTermsContent";
import EmployerNavigationBar, {
	type EmployerTabName,
} from "../../../components/layout/EmployerNavigationBar";
import EmployerWorkplaceCard from "../../../components/employer/mypage/EmployerWorkplaceCard";
import AddWorkplaceButton from "../../../components/employer/mypage/AddWorkplaceButton";
import AddWorkplaceModal from "../../../components/employer/mypage/AddWorkplaceModal";
import { getWorkplaces, getWorkplaceDetail } from "../../../api/employer";
import type { WorkplaceListItem, WorkplaceDetail } from "../../../api/employer/types";
import type { EmployerStackParamList } from "../../../navigation/EmployerStack";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
	home: "EmployerHomeMain",
	worker: "WorkerManage",
	transfer: "RemittanceManage",
};

const EmployerWorkplaceManageScreen: React.FC = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);
	const [isAddModalVisible, setIsAddModalVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof EmployerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	const [workplaces, setWorkplaces] = useState<WorkplaceListItem[]>([]);
	const [detailMap, setDetailMap] = useState<Record<number, WorkplaceDetail>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleTabPress = (tab: EmployerTabName) => {
		navigation.replace(TAB_SCREEN_MAP[tab]);
	};

	const fetchWorkplaces = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await getWorkplaces();
			if (res.success && Array.isArray(res.data)) {
				setWorkplaces(res.data);

				// 각 사업장의 상세 정보 병렬 조회
				const details = await Promise.all(
					res.data.map((w: WorkplaceListItem) => getWorkplaceDetail(w.id).catch(() => null))
				);
				const map: Record<number, WorkplaceDetail> = {};
				details.forEach((d) => {
					if (d?.success && d.data) {
						map[d.data.id] = d.data;
					}
				});
				setDetailMap(map);
			} else {
				setWorkplaces([]);
				setError(res.error?.message || "사업장 정보를 불러오지 못했습니다.");
			}
		} catch (e: any) {
			setWorkplaces([]);
			setError(e?.message || "사업장 정보를 불러오지 못했습니다.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkplaces();
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "EmployerHomeMain" }] })} />
				<Text weight="ExtraBold" style={styles.title}>
					근무지 관리
				</Text>

				{loading ? (
					<ActivityIndicator
						size="large"
						color={colors.textSecondary}
						style={styles.loading}
					/>
				) : error ? (
					<Text style={styles.error}>{error}</Text>
				) : (
					<>
						{workplaces.map((w) => {
							const detail = detailMap[w.id];
							return (
								<EmployerWorkplaceCard
									key={w.id}
									name={w.name}
									businessName={w.businessName}
									workerCount={w.workerCount ?? 0}
									colorCode={w.colorCode}
									businessNumber={detail?.businessNumber}
									address={detail?.address}
								/>
							);
						})}
						<AddWorkplaceButton onPress={() => setIsAddModalVisible(true)} />
					</>
				)}
			</ScrollView>
			<EmployerNavigationBar activeTab="home" onTabPress={handleTabPress} />

			<EmployerMyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("EmployerProfileEdit")}
				onPressWorkplaceManage={() => closeDrawer()}
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

			<AddWorkplaceModal
				visible={isAddModalVisible}
				onClose={() => setIsAddModalVisible(false)}
				onSuccess={fetchWorkplaces}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 10,
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	title: {
		marginTop: 4,
		fontSize: 24,
		color: colors.textPrimary,
		lineHeight: 52,
		marginBottom: 12,
	},
	loading: {
		marginTop: 32,
	},
	error: {
		color: colors.deleteRed,
		textAlign: "center",
		marginTop: 24,
	},
});

export default EmployerWorkplaceManageScreen;
