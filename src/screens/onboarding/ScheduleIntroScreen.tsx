import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../components/common/PrimaryButton";

interface ScheduleIntroScreenProps {
	onStartPress?: () => void;
}

const ScheduleIntroScreen: React.FC<ScheduleIntroScreenProps> = ({ onStartPress }) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>일정 조정</Text>
				<Text style={styles.subtitle}>근무기록 정정, 수정 요청을 통한{"\n"}유동적인 일정 조정 </Text>
				<Image
					source={require("../../assets/images/onboarding/scheduleIntro_image.png")}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.buttonContainer}>
				<PrimaryButton text="시작하기" onPress={onStartPress} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	content: {
		flex: 1,
		paddingHorizontal: 40,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 30,
	},
	buttonContainer: {
		paddingHorizontal: 90,
		paddingBottom: 32,
	},
	title: {
		fontSize: 40,
		color: "#000000",
		fontFamily: "Pretendard-ExtraBold",
		textAlign: "center",
	},
	subtitle: {
		marginTop: 8,
		fontSize: 16,
		color: "#848484",
		fontFamily: "Pretendard-SemiBold",
		textAlign: "center",
	},
	image: {
		marginTop: 24,
		width: "100%",
		height: 360,
	},
});

export default ScheduleIntroScreen;
