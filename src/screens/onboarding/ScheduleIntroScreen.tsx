import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScheduleIntroScreenProps {
	onStartPress?: () => void;
}

const ScheduleIntroScreen: React.FC<ScheduleIntroScreenProps> = ({ onStartPress }) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>일정 조정</Text>
				<Text style={styles.subtitle}>근무기록 정정, 수정 요청을 통한 유동적인 일정 조정 </Text>
				<Image
					source={require("../../assets/images/onboarding/scheduleIntro_image.png")}
					style={styles.image}
					resizeMode="contain"
				/>
				<TouchableOpacity
					style={styles.startButton}
					onPress={onStartPress}
					activeOpacity={0.8}
				>
					<Text style={styles.startButtonText}>시작하기</Text>
				</TouchableOpacity>
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
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 24,
	},
	title: {
		fontSize: 28,
		color: "#111827",
		fontWeight: "700",
		textAlign: "center",
	},
	subtitle: {
		marginTop: 8,
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
		textAlign: "center",
	},
	image: {
		marginTop: 24,
		width: "100%",
		height: 360,
	},
	startButton: {
		marginTop: 24,
		backgroundColor: "#3b82f6",
		paddingVertical: 14,
		paddingHorizontal: 48,
		borderRadius: 8,
	},
	startButtonText: {
		fontSize: 16,
		color: "#ffffff",
		fontWeight: "600",
		textAlign: "center",
	},
});

export default ScheduleIntroScreen;
