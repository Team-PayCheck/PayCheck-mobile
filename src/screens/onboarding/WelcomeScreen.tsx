import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WelcomeScreenProps {
	onKakaoLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onKakaoLogin }) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<View style={styles.logoContainer}>
					<Image
						source={require("../../assets/images/logo.png")}
						style={styles.logo}
					/>
					<Text style={styles.title}>PayCheck</Text>
					<Text style={styles.subtitle}>
						근로자와 고용주의 거래와 소통을 원활하게
					</Text>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.kakaoButton}
					onPress={onKakaoLogin}
					activeOpacity={0.8}
				>
					<Image
						source={require("../../assets/images/kakao_login_medium_wide.png")}
						style={styles.kakaoButtonImage}
						resizeMode="contain"
					/>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 40,
	},
	logoContainer: {
		alignItems: "center",
		gap: 3,
	},
	logo: {
		width: 200,
		height: 200,
	},
	title: {
		fontSize: 40,
		color: "#000000",
		fontFamily: "Pretendard-Bold",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 13,
		color: "#848484",
		fontFamily: "Pretendard-SemiBold",
		textAlign: "center",
	},
	buttonContainer: {
		paddingHorizontal: 40,
		paddingBottom: 40,
	},
	kakaoButton: {
		width: "100%",
		height: 50,
	},
	kakaoButtonImage: {
		width: "100%",
		height: "100%",
	},
});

export default WelcomeScreen;
