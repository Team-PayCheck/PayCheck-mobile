import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProgressBar, StepHeader, UserTypeCard } from "../../../components/signup";
import { colors } from "../../../constants/colors";
import type { UserType } from "../../../types/signup.types";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step1UserType">;

const Step1UserTypeScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [selectedType, setSelectedType] = useState<UserType | null>(null);

	const handleSelect = (type: UserType) => {
		setSelectedType(type);
		// 선택 후 잠시 대기 후 다음 화면으로 이동
		setTimeout(() => {
			navigation.navigate("Step2Profile", { userType: type });
		}, 300);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
				</TouchableOpacity>
				<View style={styles.progressBarContainer}>
					<ProgressBar currentStep={1} totalSteps={5} />
				</View>
			</View>

			{/* 콘텐츠 */}
			<View style={styles.content}>
				<StepHeader step={1} totalSteps={5} title="회원유형" />

				<View style={styles.cardContainer}>
					<UserTypeCard
						type="WORKER"
						selected={selectedType === "WORKER"}
						onPress={() => handleSelect("WORKER")}
					/>
					<UserTypeCard
						type="EMPLOYER"
						selected={selectedType === "EMPLOYER"}
						onPress={() => handleSelect("EMPLOYER")}
					/>
				</View>
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
		gap: 60,
	},
	cardContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
	},
});

export default Step1UserTypeScreen;
