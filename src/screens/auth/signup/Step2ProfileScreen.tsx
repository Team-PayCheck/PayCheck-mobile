import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	SignUpScreenLayout,
	ProfileImagePicker,
	TextButton,
} from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
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
		<SignUpScreenLayout
			currentStep={2}
			stepTitle="프로필 사진 (선택)"
			contentStyle={styles.content}
			footer={
				<>
					<PrimaryButton
						text="다음"
						onPress={handleNext}
						disabled={!profileImageUri}
					/>
					<TextButton text="나중에 설정하기" onPress={handleSkip} />
				</>
			}
		>
			<View style={styles.imageContainer}>
				<ProfileImagePicker
					imageUri={profileImageUri}
					onPress={handleImagePress}
				/>
			</View>
		</SignUpScreenLayout>
	);
};

const styles = StyleSheet.create({
	content: {
		gap: 60,
	},
	imageContainer: {
		alignItems: "center",
	},
});

export default Step2ProfileScreen;
