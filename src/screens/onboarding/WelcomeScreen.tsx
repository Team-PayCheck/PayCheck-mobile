import React, { useState } from "react";
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Text } from "../../components/common/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "@react-native-seoul/kakao-login";
import { kakaoLoginWithToken } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";

interface WelcomeScreenProps {
	onLoginSuccess?: (userType: "EMPLOYER" | "WORKER") => void;
	onSignUpNeeded?: (kakaoAccessToken: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
	onLoginSuccess,
	onSignUpNeeded,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const authLogin = useAuthStore((state) => state.login);

	const handleKakaoLogin = async () => {
		setIsLoading(true);
		try {
			const token = await login();
			const accessToken = token?.accessToken;

			if (!accessToken) {
				Alert.alert(
					"로그인 실패",
					"카카오 액세스 토큰을 가져오지 못했습니다."
				);
				return;
			}

			const loginResult = await kakaoLoginWithToken(accessToken);

			// 회원가입 필요 (NOT_FOUND 또는 UNAUTHORIZED)
			if (
				!loginResult.success &&
				(loginResult.error?.code === "NOT_FOUND" ||
					loginResult.error?.code === "UNAUTHORIZED")
			) {
				onSignUpNeeded?.(accessToken);
				return;
			}

			// 기존 회원인 경우 (success: true)
			if (loginResult.success && loginResult.data?.accessToken) {
				// Zustand에 토큰 + 사용자 정보 저장 (자동으로 AsyncStorage에도 persist)
				authLogin(loginResult.data.accessToken, {
					userType: loginResult.data.userType,
					userId: loginResult.data.userId,
					name: loginResult.data.name,
				});

				// userType에 따라 콜백 호출
				onLoginSuccess?.(loginResult.data.userType);
				return;
			}

			// 그 외 에러
			throw new Error(loginResult.error?.message || "로그인에 실패했습니다.");
		} catch (error) {
			console.error("로그인 에러:", error);
			const message =
				(error as { message?: string })?.message ||
				"로그인에 실패했습니다. 다시 시도해주세요.";
			Alert.alert("로그인 실패", message);
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
					<Text weight="Bold" style={styles.title}>
						PayCheck
					</Text>
					<Text weight="SemiBold" style={styles.subtitle}>
						근로자와 고용주의 거래와 소통을 원활하게
					</Text>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#3b82f6" />
						<Text weight="Medium" style={styles.loadingText}>
							로그인 중...
						</Text>
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
		textAlign: "center",
	},
	subtitle: {
		fontSize: 13,
		color: "#848484",
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
