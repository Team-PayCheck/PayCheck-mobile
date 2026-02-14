import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/common/Text";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/RootNavigator";

type SignUpScreenRouteProp = RouteProp<RootStackParamList, "SignUp">;

interface SignUpScreenProps {
	route?: SignUpScreenRouteProp;
}

const SignUpScreen: React.FC<SignUpScreenProps> = () => {
	const route = useRoute<SignUpScreenRouteProp>();
	const kakaoAccessToken = route.params?.kakaoAccessToken;

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text weight="Bold" style={styles.title}>회원가입</Text>
				<Text weight="Medium" style={styles.subtitle}>
					사용자 정보를 입력해주세요
				</Text>
				{kakaoAccessToken && (
					<Text style={styles.debug}>Token: {kakaoAccessToken.slice(0, 20)}...</Text>
				)}
				<Text weight="Medium" style={styles.placeholder}>
					회원가입 임시화면
				</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 40,
		gap: 16,
	},
	title: {
		fontSize: 28,
		color: "#111111",
	},
	subtitle: {
		fontSize: 14,
		color: "#777777",
	},
	debug: {
		fontSize: 12,
		color: "#999999",
	},
	placeholder: {
		fontSize: 13,
		color: "#CCCCCC",
		textAlign: "center",
		lineHeight: 20,
	},
});

export default SignUpScreen;
