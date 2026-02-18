import React, { useState } from "react";
import { Alert, StyleSheet, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";
import { colors } from "../../../constants/colors";


type Props = NativeStackScreenProps<WorkerStackParamList, "AccountSettings">;

const AccountSettingsScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const closeDrawer = () => setIsDrawerVisible(false);
	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};
	const { useLogoutHandler } = require("../../../hooks/common/useLogoutHandler");
	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	return (
	<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.scrollContent}>
				<View style={styles.headerRow}>
					<View style={{ flex: 1 }}>
						<HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
						<Text weight="ExtraBold" style={styles.title}>계정 이용 / 이용동의</Text>
					</View>
					<View style={styles.illustWrapper}>
						<Image
							source={require("../../../assets/images/mypage/info.png")}
							style={styles.illust}
							resizeMode="contain"
						/>
					</View>
				</View>
			</View>
		<MyPageDrawer
			visible={isDrawerVisible}
			onClose={closeDrawer}
			onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
			onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
			onPressSentRequests={() => navigateFromDrawer("SentRequests")}
			onPressAccountSettings={() => closeDrawer()}
			onPressLogout={handleLogout}
			onPressWithdraw={() => navigateFromDrawer("Withdraw")}
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
});

export default AccountSettingsScreen;
