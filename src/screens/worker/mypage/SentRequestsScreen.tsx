import React, { useState } from "react";
import { Alert, StyleSheet, View, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import { dummyRequests } from "../../../dummyData/workerMyPage";
import SentRequestCard from "../../../components/mypage/sentRequests/SentRequestCard";

type Props = NativeStackScreenProps<WorkerStackParamList, "SentRequests">;

const SentRequestsScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [openIdx, setOpenIdx] = useState<number | null>(null);

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
					<Text weight="ExtraBold" style={styles.title}>보낸 근무요청 보기</Text>
				</View>
				<View style={styles.illustWrapper}>
					<Image
						source={require("../../../assets/images/mypage/chat.png")}
						style={styles.illust}
						resizeMode="contain"
					/>
				</View>
			</View>

			<View style={styles.cardList}>
				{dummyRequests.map((r, idx) => (
				  <SentRequestCard
					key={r.workplace + r.date + r.time + idx}
					request={r}
					expanded={openIdx === idx}
					onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
				  />
				))}
			</View>

			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => closeDrawer()}
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
});

export default SentRequestsScreen;
