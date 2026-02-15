import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { ProgressBar, StepHeader, TextButton } from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { Text } from "../../../components/common/Text";
import { colors } from "../../../constants/colors";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step4Alarm">;
type RoutePropType = RouteProp<SignUpStackParamList, "Step4Alarm">;

const Step4AlarmScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const route = useRoute<RoutePropType>();
	const { userType, profileImageUri, name, phone, bankName, accountNumber } =
		route.params;

	const handleAllowAlarm = () => {
		// TODO: 푸시 알림 권한 요청 (expo-notifications)
		console.log("알람 허용");
		navigation.navigate("Step5Complete", {
			userType,
			profileImageUri,
			name,
			phone,
			bankName,
			accountNumber,
			isAlarmEnabled: true,
		});
	};

	const handleSkip = () => {
		navigation.navigate("Step5Complete", {
			userType,
			profileImageUri,
			name,
			phone,
			bankName,
			accountNumber,
			isAlarmEnabled: false,
		});
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
				<PrimaryButton text="알람 허용" onPress={handleAllowAlarm} />
				<TextButton text="나중에 설정하기" onPress={handleSkip} />
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
