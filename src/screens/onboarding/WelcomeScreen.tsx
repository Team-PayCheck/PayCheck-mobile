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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { ResponseType } from "expo-auth-session";
import axios from "axios";
import { KAKAO_CONFIG, HTTP_STATUS } from "../../constants/kakao";
import { kakaoLoginWithToken, saveAccessToken } from "../../api/authApi";

const KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";
const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

const getRedirectUri = () => {
	const configured = (KAKAO_CONFIG.REDIRECT_URI || "").trim();

	if (!configured) {
		throw new Error("카카오 Redirect URI가 설정되지 않았습니다.");
	}

	return configured;
};

interface WelcomeScreenProps {
	onKakaoLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onKakaoLogin }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleKakaoLogin = async () => {
		setIsLoading(true);
		try {
			if (!KAKAO_CONFIG.REST_API_KEY) {
				Alert.alert("설정 오류", "카카오 REST API 키가 설정되지 않았습니다.");
				return;
			}

			const redirectUri = getRedirectUri();
			const discovery = { authorizationEndpoint: KAKAO_AUTHORIZE_URL };
			const request = await AuthSession.loadAsync(
				{
					clientId: KAKAO_CONFIG.REST_API_KEY,
					redirectUri,
					responseType: ResponseType.Code,
					usePKCE: false,
				},
				discovery
			);

			const authResult = await request.promptAsync(discovery);

			if (authResult.type !== "success") {
				Alert.alert("로그인 취소", "카카오 로그인 진행이 취소되었습니다.");
				return;
			}

			const code = authResult.params?.code;
			const authError = authResult.params?.error;

			if (authError) {
				Alert.alert("로그인 실패", "카카오 인증에 실패했습니다.");
				return;
			}

			if (!code) {
				Alert.alert("로그인 실패", "인가 코드가 없습니다.");
				return;
			}

			const tokenParams =
				`grant_type=authorization_code` +
				`&client_id=${encodeURIComponent(KAKAO_CONFIG.REST_API_KEY)}` +
				`&redirect_uri=${encodeURIComponent(redirectUri)}` +
				`&code=${encodeURIComponent(code)}`;

			const tokenResponse = await axios.post<{ access_token?: string }>(
				KAKAO_TOKEN_URL,
				tokenParams,
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
					},
				}
			);

			const kakaoAccessToken = tokenResponse.data?.access_token;
			if (!kakaoAccessToken) {
				Alert.alert("로그인 실패", "카카오 액세스 토큰을 받지 못했습니다.");
				return;
			}

			try {
				const loginResponse = await kakaoLoginWithToken(kakaoAccessToken);

				if (loginResponse.success && loginResponse.data?.accessToken) {
					await saveAccessToken(loginResponse.data.accessToken);
					await AsyncStorage.setItem("@user_logged_in", "true");
					await AsyncStorage.setItem("@user_type", loginResponse.data.userType);
					await AsyncStorage.setItem("@user_id", String(loginResponse.data.userId));
					await AsyncStorage.setItem("@user_name", loginResponse.data.userName);

					if (onKakaoLogin) {
						onKakaoLogin();
					}
				} else {
					throw new Error("로그인에 실패했습니다.");
				}
			} catch (error: any) {
				const statusCode = Number(error?.status) || 0;
				const isUserNotFound =
					statusCode === HTTP_STATUS.NOT_FOUND ||
					statusCode === HTTP_STATUS.UNAUTHORIZED;

				if (isUserNotFound) {
					Alert.alert(
						"회원가입 필요",
						"등록되지 않은 계정입니다. 회원가입 화면으로 이동이 필요합니다."
					);
					return;
				}

				Alert.alert(
					"로그인 실패",
					error?.message || "서버 로그인에 실패했습니다."
				);
			}
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
