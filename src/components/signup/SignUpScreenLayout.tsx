import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "./ProgressBar";
import StepHeader from "./StepHeader";
import { colors } from "../../constants/colors";

interface SignUpScreenLayoutProps {
	/** 현재 단계 (1~5) */
	currentStep: number;
	/** 단계 타이틀 */
	stepTitle: string;
	/** 뒤로가기 버튼 표시 여부 (기본값: true) */
	showBackButton?: boolean;
	/** 뒤로가기 버튼 비활성화 여부 */
	backButtonDisabled?: boolean;
	/** 콘텐츠 영역 */
	children: React.ReactNode;
	/** 하단 버튼 영역 */
	footer?: React.ReactNode;
	/** 콘텐츠 영역 스타일 오버라이드 */
	contentStyle?: ViewStyle;
}

const TOTAL_STEPS = 4;

const SignUpScreenLayout: React.FC<SignUpScreenLayoutProps> = ({
	currentStep,
	stepTitle,
	showBackButton = true,
	backButtonDisabled = false,
	children,
	footer,
	contentStyle,
}) => {
	const navigation = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				{showBackButton ? (
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
						disabled={backButtonDisabled}
					>
						<Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
					</TouchableOpacity>
				) : (
					<View style={styles.backButtonPlaceholder} />
				)}
				<View style={styles.progressBarContainer}>
					<ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
				</View>
			</View>

			{/* 콘텐츠 */}
			<View style={[styles.content, contentStyle]}>
				<StepHeader step={currentStep} totalSteps={TOTAL_STEPS} title={stepTitle} />
				{children}
			</View>

			{/* 하단 버튼 */}
			{footer && <View style={styles.footer}>{footer}</View>}
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
	backButtonPlaceholder: {
		width: 32,
	},
	progressBarContainer: {
		flex: 1,
		marginLeft: 8,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		paddingTop: 40,
	},
	footer: {
		paddingHorizontal: 40,
		paddingBottom: 20,
		gap: 8,
		alignItems: "center",
	},
});

export default SignUpScreenLayout;
