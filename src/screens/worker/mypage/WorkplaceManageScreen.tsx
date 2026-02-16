import React, { useState } from "react";
import { Alert, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import WorkplaceCard from "../../../components/mypage/workplaceManage/WorkplaceCard";
import { dummyWorkplaces } from "../../../dummyData/workerMyPage";

type Props = NativeStackScreenProps<WorkerStackParamList, "WorkplaceManage">;

const WorkplaceManageScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.headerRow}>
				<View style={{ flex: 1 }}>
					<HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
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
				{dummyWorkplaces.map((w, idx) => (
					<WorkplaceCard key={w.name + idx} name={w.name} joinedAt={w.joinedAt} wage={w.wage} />
				))}
			</View>

			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => closeDrawer()}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
				onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
				onPressLogout={() => {
					closeDrawer();
					Alert.alert("로그아웃", "로그아웃 기능은 다음 단계에서 연결됩니다.");
				}}
				onPressWithdraw={() => navigateFromDrawer("Withdraw")}
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
		color: "#353535",
		lineHeight: 52,
	},
	cardList: {
		marginTop: 8,
	},
	card: {
		backgroundColor: "#FFF",
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		shadowColor: "#000",
		shadowOpacity: 0.07,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 8,
		elevation: 3,
		marginBottom: 16,
	},
	cardLabel: {
		fontSize: 16,
		color: "#848484",
		marginBottom: 6,
	},
	cardValue: {
		color: "#000",
	},
});

export default WorkplaceManageScreen;
