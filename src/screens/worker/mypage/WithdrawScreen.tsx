import React, { useState } from "react";
import { Alert, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/worker/mypage/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";

type Props = NativeStackScreenProps<WorkerStackParamList, "Withdraw">;

const WithdrawScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	const handleWithdraw = () => {
		Alert.alert("회원 탈퇴", "정말로 탈퇴하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{ text: "탈퇴", style: "destructive", onPress: () => {/* API 연동 예정 */} },
		]);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.headerArea}>
				<HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
			</View>
			<View style={styles.contentArea}>
				<Image source={require("../../../assets/images/mypage/quit.png")} style={styles.illust} resizeMode="contain" />
				<Text weight="ExtraBold" style={styles.title}>회원 탈퇴하기</Text>
				<Text style={styles.desc}>회원 탈퇴시 30일 이후 기존의 고용 정보가 말소됩니다</Text>
				<View style={styles.buttonRow}>
					<TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
						<Text style={styles.cancelText}>취소</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.8} onPress={handleWithdraw}>
						<Text weight="Bold" style={styles.withdrawText}>회원탈퇴</Text>
					</TouchableOpacity>
				</View>
			</View>
			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
				onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
				onPressLogout={() => {
					closeDrawer();
					Alert.alert("로그아웃", "로그아웃 기능은 다음 단계에서 연결됩니다.");
				}}
				onPressWithdraw={() => closeDrawer()}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		paddingHorizontal: 24,
	},
	headerArea: {
		paddingTop: 10,
		gap: 16,
	},
	contentArea: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	illust: {
		width: 402,
		height: 268,
	},
	title: {
		fontSize: 24,
		color: "#161616",
		marginBottom: 4,
		textAlign: "center",
	},
	desc: {
		color: "#848484",
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
		backgroundColor: "#FDFDFD",
		borderRadius: 22,
		paddingHorizontal: 32,
		paddingVertical: 12,
		minWidth: 100,
		alignItems: "center",
		marginRight: 2,
	},
	withdrawBtn: {
		backgroundColor: "#F17D77",
		borderRadius: 22,
		paddingHorizontal: 32,
		paddingVertical: 12,
		minWidth: 100,
		alignItems: "center",
	},
	cancelText: {
		color: "#F17D77",
		fontSize: 14,
		fontWeight: "bold",
	},
	withdrawText: {
		color: "#fff",
		fontSize: 14,
	},
});

export default WithdrawScreen;
