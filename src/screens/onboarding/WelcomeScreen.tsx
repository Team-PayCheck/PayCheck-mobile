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
import { kakaoLoginWithToken, devLogin } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import type { LoginError } from "../../api/auth/types";
import { colors } from "../../constants/colors";

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
		let kakaoAccessToken: string | undefined;

		try {
			const token = await login();
			kakaoAccessToken = token?.accessToken;

			if (!kakaoAccessToken) {
				Alert.alert(
					"로그인 실패",
					"카카오 액세스 토큰을 가져오지 못했습니다."
				);
				return;
			}

			const loginResult = await kakaoLoginWithToken(kakaoAccessToken);

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

			// 그 외 에러 (success: false인 경우)
			throw new Error(loginResult.error?.message || "로그인에 실패했습니다.");
		} catch (error) {
			const loginError = error as LoginError;

			// 404 (USER_NOT_FOUND) → 회원가입으로 이동
			if (
				loginError.status === 404 &&
				loginError.code === "USER_NOT_FOUND"
			) {
				if (kakaoAccessToken) {
					onSignUpNeeded?.(kakaoAccessToken);
					return;
				}
			}

			// 그 외 에러
			const message =
				loginError.message || "로그인에 실패했습니다. 다시 시도해주세요.";
			Alert.alert("로그인 실패", message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDevLogin = async () => {
		setIsLoading(true);
		try {
			const result = await devLogin(1, "박지성", "EMPLOYER");

			if (result.success && result.data?.accessToken) {
				authLogin(result.data.accessToken, {
					userType: result.data.userType,
					userId: result.data.userId,
					name: result.data.name,
				});
				onLoginSuccess?.(result.data.userType);
			}
		} catch (error) {
			Alert.alert("Dev 로그인 실패", "서버 연결을 확인해주세요.");
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
						<ActivityIndicator size="large" color={colors.primary} />
						<Text weight="Medium" style={styles.loadingText}>
							로그인 중...
						</Text>
					</View>
				) : (
					<>
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
						{__DEV__ && (
							<TouchableOpacity
								style={styles.devButton}
								onPress={handleDevLogin}
								activeOpacity={0.7}
							>
								<Text weight="Medium" style={styles.devButtonText}>
									[Dev] 로그인
								</Text>
							</TouchableOpacity>
						)}
					</>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
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
		color: colors.black,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 13,
		color: colors.textSecondary,
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
		color: colors.primary,
	},
	kakaoButton: {
		width: "100%",
		height: 50,
	},
	kakaoButtonImage: {
		width: "100%",
		height: "100%",
	},
	devButton: {
		marginTop: 16,
		paddingVertical: 12,
		paddingHorizontal: 24,
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: colors.grey,
		borderStyle: "dashed",
	},
	devButtonText: {
		fontSize: 14,
		color: colors.textSecondary,
		textAlign: "center",
	},
});

export default WelcomeScreen;
