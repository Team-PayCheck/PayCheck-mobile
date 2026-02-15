import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgressBar, StepHeader } from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../constants/colors";
import { useSignUpStore } from "../../../stores";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step5Complete">;

const Step5CompleteScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();

	const userType = useSignUpStore((state) => state.userType);
	const resetSignUp = useSignUpStore((state) => state.reset);

	const isWorker = userType === "WORKER";
	const buttonText = isWorker ? "시작하기" : "매장 관리하러 가기";

	const handleStart = () => {
		// SignUp Store 초기화
		resetSignUp();

		if (isWorker) {
			// 근로자: WorkerHome으로 이동
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "WorkerHome" }],
				})
			);
		} else {
			// 고용주: WorkplaceManage로 이동
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "WorkplaceManage" }],
				})
			);
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
				<PrimaryButton text={buttonText} onPress={handleStart} />
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
