import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgressBar, StepHeader, TextButton } from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../constants/colors";
import { requestNotificationPermission } from "../../../utils/notification";
import { kakaoRegisterWithToken } from "../../../api/authApi";
import { useSignUpStore, useAuthStore } from "../../../stores";
import { showError } from "../../../utils/alert";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";
import type { LoginError } from "../../../types/api.types";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step4Alarm">;

const Step4AlarmScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [isLoading, setIsLoading] = useState(false);

	// SignUp Store에서 데이터 가져오기
	const kakaoAccessToken = useSignUpStore((state) => state.kakaoAccessToken);
	const userType = useSignUpStore((state) => state.userType);
	const profileImageBase64 = useSignUpStore((state) => state.profileImageBase64);
	const name = useSignUpStore((state) => state.name);
	const phone = useSignUpStore((state) => state.phone);
	const bankName = useSignUpStore((state) => state.bankName);
	const accountNumber = useSignUpStore((state) => state.accountNumber);
	const resetSignUp = useSignUpStore((state) => state.reset);

	// Auth Store
	const authLogin = useAuthStore((state) => state.login);

	const isWorker = userType === "WORKER";

	// 회원가입 API 호출
	const handleRegister = async () => {
		if (!kakaoAccessToken || !userType) {
			showError("오류", "회원가입 정보가 올바르지 않습니다.");
			return false;
		}

		setIsLoading(true);

		try {
			const response = await kakaoRegisterWithToken({
				kakaoAccessToken,
				name,
				userType,
				phone,
				bankName: isWorker ? bankName : "",
				accountNumber: isWorker ? accountNumber : "",
				profileImageUrl: profileImageBase64 || "",
			});

			if (response.success && response.data) {
				// Zustand에 저장 (자동으로 AsyncStorage에 persist)
				authLogin(response.data.accessToken, {
					userId: response.data.userId,
					name: response.data.name,
					userType: response.data.userType as "EMPLOYER" | "WORKER",
				});

				return true;
			}
			return false;
		} catch (error) {
			const loginError = error as LoginError;

			// 400 에러 (이미 가입된 계정 등)
			if (loginError.status === 400) {
				showError("회원가입 실패", loginError.message);
			} else {
				// 그 외 에러
				showError("회원가입 실패", "회원가입에 실패하였습니다.");
			}

			// SignUp Store 초기화
			resetSignUp();

			// Welcome 화면으로 이동 (스택 초기화)
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "Welcome" }],
				})
			);

			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleAllowAlarm = async () => {
		await requestNotificationPermission();
		const success = await handleRegister();
		if (success) {
			navigation.navigate("Step5Complete");
		}
	};

	const handleSkip = async () => {
		const success = await handleRegister();
		if (success) {
			navigation.navigate("Step5Complete");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
					disabled={isLoading}
				>
					<Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
				</TouchableOpacity>
				<View style={styles.progressBarContainer}>
					<ProgressBar currentStep={4} totalSteps={5} />
				</View>
			</View>

			{/* 콘텐츠 */}
			<View style={styles.content}>
				<StepHeader step={4} totalSteps={5} title="알람 설정" />

				<View style={styles.imageContainer}>
					<Image
						source={require("../../../assets/images/signup/megaphone.png")}
						style={styles.image}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.textContainer}>
					<Text weight="Bold" style={styles.title}>
						푸시알림을 받아보세요
					</Text>
					<Text weight="Medium" style={styles.description}>
						일정 전달사항과 공지, 기타 안내사항을{"\n"}빠르고 간결하게 읽어봐요!
					</Text>
				</View>
			</View>

			{/* 하단 버튼 */}
			<View style={styles.footer}>
				{isLoading ? (
					<ActivityIndicator size="large" color={colors.primary} />
				) : (
					<>
						<PrimaryButton text="알람 허용" onPress={handleAllowAlarm} />
						<TextButton text="나중에 설정하기" onPress={handleSkip} />
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
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButton: {
		padding: 4,
	},
	progressBarContainer: {
		flex: 1,
		marginLeft: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 40,
		gap: 32,
	},
	imageContainer: {
		alignItems: "center",
		paddingVertical: 20,
	},
	image: {
		width: 250,
		height: 250,
	},
	textContainer: {
		alignItems: "center",
		gap: 12,
	},
	title: {
		fontSize: 22,
		color: colors.textPrimary,
		textAlign: "center",
	},
	description: {
		fontSize: 14,
		color: colors.textSecondary,
		textAlign: "center",
		lineHeight: 22,
	},
	footer: {
		paddingHorizontal: 40,
		paddingBottom: 20,
		gap: 8,
		alignItems: "center",
	},
});

export default Step4AlarmScreen;
