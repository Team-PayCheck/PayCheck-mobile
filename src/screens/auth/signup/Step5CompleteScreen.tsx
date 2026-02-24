import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SignUpScreenLayout } from "../../../components/signup";
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

	const handleStart = () => {
		// SignUp Store 초기화
		resetSignUp();

		if (isWorker) {
			// 근로자: WorkerWeeklyCalendar으로 이동
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "WorkerWeeklyCalendar" }],
				})
			);
		} else {
			// 고용주: EmployerHome으로 이동
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{ name: "EmployerHome" }],
				})
			);
		}
	};

	return (
		<SignUpScreenLayout
			currentStep={5}
			stepTitle="가입완료"
			showBackButton={false}
			contentStyle={styles.content}
			footer={<PrimaryButton text="시작하기" onPress={handleStart} />}
		>
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
		</SignUpScreenLayout>
	);
};

const styles = StyleSheet.create({
	content: {
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
});

export default Step5CompleteScreen;
