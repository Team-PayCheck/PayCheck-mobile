import React, { useState } from "react";
import { Alert, StyleSheet, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { deleteMyAccount, logout } from "../../../api/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import { colors } from "../../../constants/colors";
import { useLogoutHandler } from "../../../hooks/common/useLogoutHandler";


type Props = NativeStackScreenProps<WorkerStackParamList, "Withdraw">;

const WithdrawScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	// 탈퇴 버튼 클릭 시 확인 모달
	const handleWithdraw = () => {
		Alert.alert("회원 탈퇴", "정말로 탈퇴하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{ text: "탈퇴", style: "destructive", onPress: withdrawApi },
		]);
	};

	// 실제 탈퇴 API 호출 및 후처리
	const withdrawApi = async () => {
		setLoading(true);
		try {
			await deleteMyAccount(); // 1. 서버에 회원 탈퇴 요청
			Alert.alert("탈퇴 완료", "회원 탈퇴가 완료되었습니다.", [
				{
					text: "확인",
					onPress: async () => {
						await logout(); // 2. 클라이언트 상태/토큰 초기화
						// 3. 앱 최상위 네비게이터에서 Welcome(로그인/온보딩)으로 이동
						navigation.getParent()?.reset({ index: 0, routes: [{ name: "Welcome" }] });
					},
				},
			]);
		} catch (error: any) {
			const message = error?.message || "회원 탈퇴 중 오류가 발생했습니다.";
			Alert.alert("탈퇴 실패", message, [{ text: "확인" }]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.scrollContent}>
				<View style={styles.headerArea}>
					<HomeBackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: "WorkerHomeMain" }] })} />
				</View>
				<View style={styles.contentArea}>
					<Image source={require("../../../assets/images/mypage/quit.png")} style={styles.illust} resizeMode="contain" />
					<Text weight="ExtraBold" style={styles.title}>회원 탈퇴하기</Text>
					<Text style={styles.desc}>회원 탈퇴시 30일 이후 기존의 고용 정보가 말소됩니다</Text>
					<View style={styles.buttonRow}>
						<TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={() => navigation.goBack()} disabled={loading}>
							<Text style={styles.cancelText}>취소</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8} onPress={handleWithdraw} disabled={loading}>
							{loading ? (
								<ActivityIndicator color={colors.white} />
							) : (
								<Text weight="Bold" style={styles.withdrawText}>회원탈퇴</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
				onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
				onPressLogout={handleLogout}
				onPressWithdraw={() => closeDrawer()}
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
		flex: 1,
		paddingTop: 10,
		paddingHorizontal: 20,
		paddingBottom: 40,
		gap: 24,
	},
	headerArea: {
		paddingTop: 10,
		gap: 16,
	},
	contentArea: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 60,
	},
	illust: {
		width: 402,
		height: 268,
	},
	title: {
		fontSize: 24,
		color: colors.textPrimary,
		marginBottom: 4,
		textAlign: "center",
	},
	desc: {
		color: colors.textSecondary,
		fontSize: 12,
		marginBottom: 32,
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 18,
	},
	cancelBtn: {
		backgroundColor: colors.white,
		borderRadius: 22,
		paddingHorizontal: 32,
		paddingVertical: 12,
		minWidth: 100,
		alignItems: "center",
		marginRight: 2,
	},
	withdrawBtn: {
		backgroundColor: colors.red,
		borderRadius: 22,
		paddingHorizontal: 32,
		paddingVertical: 12,
		minWidth: 100,
		alignItems: "center",
	},
	cancelText: {
		color: colors.red,
		fontSize: 14,
		fontWeight: "bold",
	},
	withdrawText: {
		color: colors.white,
		fontSize: 14,
	},
});

export default WithdrawScreen;
