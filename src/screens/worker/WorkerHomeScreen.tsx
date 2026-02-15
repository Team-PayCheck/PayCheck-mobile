import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "../../components/common/Text";
import MyPageDrawer from "../../components/worker/mypage/MyPageDrawer";
import { WorkerStackParamList } from "../../navigation/WorkerStack";

type Props = NativeStackScreenProps<WorkerStackParamList, "WorkerHomeMain">;

const WorkerHomeScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => setIsDrawerVisible(true)} activeOpacity={0.8}>
					<Feather name="align-left" size={28} color="#111111" />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8}>
					<Ionicons name="notifications-outline" size={28} color="#111111" />
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				<Text weight="Bold" style={styles.title}>근로자홈</Text>
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
				onPressWithdraw={() => navigateFromDrawer("Withdraw")}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		color: "#111111",
	},
});

export default WorkerHomeScreen;
