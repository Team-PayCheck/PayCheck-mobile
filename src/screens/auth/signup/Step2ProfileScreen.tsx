import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	ProgressBar,
	StepHeader,
	ProfileImagePicker,
	TextButton,
} from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { colors } from "../../../constants/colors";
import { useSignUpStore } from "../../../stores";
import { pickProfileImage } from "../../../utils/image";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step2Profile">;

const Step2ProfileScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const profileImageUri = useSignUpStore((state) => state.profileImageUri);
	const setProfileImage = useSignUpStore((state) => state.setProfileImage);

	const handleImagePress = async () => {
		const result = await pickProfileImage();
		if (result) {
			setProfileImage(result.uri, result.base64);
		}
	};

	const handleNext = () => {
		navigation.navigate("Step3BasicInfo");
	};

	const handleSkip = () => {
		setProfileImage(null, null);
		navigation.navigate("Step3BasicInfo");
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
					<ProgressBar currentStep={2} totalSteps={5} />
				</View>
			</View>

			{/* 콘텐츠 */}
			<View style={styles.content}>
				<StepHeader step={2} totalSteps={5} title="프로필 사진 (선택)" />

				<View style={styles.imageContainer}>
					<ProfileImagePicker
						imageUri={profileImageUri}
						onPress={handleImagePress}
					/>
				</View>
			</View>

			{/* 하단 버튼 */}
			<View style={styles.footer}>
				<PrimaryButton
					text="다음"
					onPress={handleNext}
					disabled={!profileImageUri}
				/>
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
		gap: 60,
	},
	imageContainer: {
		alignItems: "center",
	},
	footer: {
		paddingHorizontal: 40,
		paddingBottom: 20,
		gap: 8,
		alignItems: "center",
	},
});

export default Step2ProfileScreen;
