import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgressBar, StepHeader } from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../constants/colors";
import { useSignUpStore, useAuthStore } from "../../../stores";
import { kakaoRegisterWithToken } from "../../../api/authApi";
import { showError } from "../../../utils/alert";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";
import type { LoginError } from "../../../types/api.types";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step5Complete">;

const Step5CompleteScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [isLoading, setIsLoading] = useState(false);

	// SignUp Store에서 데이터 가져오기
	const kakaoAccessToken = useSignUpStore((state) => state.kakaoAccessToken);
	const userType = useSignUpStore((state) => state.userType);
	const profileImageUri = useSignUpStore((state) => state.profileImageUri);
	const name = useSignUpStore((state) => state.name);
	const phone = useSignUpStore((state) => state.phone);
	const bankName = useSignUpStore((state) => state.bankName);
	const accountNumber = useSignUpStore((state) => state.accountNumber);
	const resetSignUp = useSignUpStore((state) => state.reset);

	// Auth Store
	const authLogin = useAuthStore((state) => state.login);

	const isWorker = userType === "WORKER";
	const buttonText = isWorker ? "시작하기" : "매장 관리하러 가기";

	const handleStart = async () => {
		if (!kakaoAccessToken || !userType) {
			showError("오류", "회원가입 정보가 올바르지 않습니다.");
			return;
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
				profileImageUrl: profileImageUri || "",
			});

			if (response.success && response.data) {
				// Zustand에 저장 (자동으로 AsyncStorage에 persist)
				authLogin(response.data.accessToken, {
					userId: response.data.userId,
					name: response.data.name,
					userType: response.data.userType as "EMPLOYER" | "WORKER",
				});

				// SignUp Store 초기화
				resetSignUp();

				// 홈 화면으로 이동 (스택 초기화)
				const targetRoute = isWorker ? "WorkerHome" : "EmployerHome";
				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: targetRoute }],
					})
				);
			}
		} catch (error) {
			const loginError = error as LoginError;
			showError("회원가입 실패", loginError.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* 헤더 - 뒤로가기 버튼 없음 */}
			<View style={styles.header}>
				<View style={styles.progressBarContainer}>
					<ProgressBar currentStep={5} totalSteps={5} />
				</View>
			</View>

			{/* 콘텐츠 */}
			<View style={styles.content}>
				<StepHeader step={5} totalSteps={5} title="가입완료" />

				<View style={styles.imageContainer}>
					<Image
						source={require("../../../assets/images/signup/check-icon.png")}
						style={styles.image}
						resizeMode="contain"
					/>
				</View>

				<View style={styles.textContainer}>
					<Text weight="Bold" style={styles.title}>
						회원가입이 완료되었습니다!
					</Text>
					<Text weight="Medium" style={styles.description}>
						추후 개인정보 수정은{"\n"}마이페이지에서 가능합니다.
					</Text>
				</View>
			</View>

			{/* 하단 버튼 */}
			<View style={styles.footer}>
				{isLoading ? (
					<ActivityIndicator size="large" color={colors.primary} />
				) : (
					<PrimaryButton text={buttonText} onPress={handleStart} />
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
	progressBarContainer: {
		flex: 1,
		paddingLeft: 32,
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
		width: 200,
		height: 200,
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
		alignItems: "center",
	},
});

export default Step5CompleteScreen;
