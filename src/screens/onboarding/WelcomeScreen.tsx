import React, { useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KakaoLogin from "@react-native-seoul/kakao-login";

interface WelcomeScreenProps {
	onKakaoLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onKakaoLogin }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleKakaoLogin = async () => {
		setIsLoading(true);
		try {
			const token = await KakaoLogin.login();
			const accessToken = token?.accessToken;

			if (!accessToken) {
				Alert.alert("로그인 실패", "카카오 액세스 토큰을 가져오지 못했습니다.");
				return;
			}

			Alert.alert("로그인 성공", "카카오 로그인에 성공했습니다.");
		} catch (error) {
			console.error("로그인 에러:", error);
			Alert.alert("로그인 실패", "로그인에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Image
						source={require("../../assets/images/logo.png")}
						style={styles.logo}
					/>
					<Text style={styles.title}>PayCheck</Text>
					<Text style={styles.subtitle}>
						근로자와 고용주의 거래와 소통을 원활하게
					</Text>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#3b82f6" />
						<Text style={styles.loadingText}>로그인 중...</Text>
					</View>
				) : (
					<TouchableOpacity
						style={styles.kakaoButton}
						onPress={handleKakaoLogin}
						activeOpacity={0.8}
					>
						<Image
							source={require("../../assets/images/kakao_login_medium_wide.png")}
							style={styles.kakaoButtonImage}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				)}
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
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	logoContainer: {
		alignItems: "center",
		gap: 3,
	},
	logo: {
		width: 200,
		height: 200,
	},
	title: {
		fontSize: 40,
		color: "#000000",
		fontFamily: "Pretendard-Bold",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 13,
		color: "#848484",
		fontFamily: "Pretendard-SemiBold",
		textAlign: "center",
	},
	buttonContainer: {
		paddingHorizontal: 40,
		paddingBottom: 40,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
		paddingVertical: 30,
	},
	loadingText: {
		fontSize: 14,
		color: "#3b82f6",
		fontFamily: "Pretendard-Medium",
	},
	kakaoButton: {
		width: "100%",
		height: 50,
	},
	kakaoButtonImage: {
		width: "100%",
		height: "100%",
	},
});

export default WelcomeScreen;
