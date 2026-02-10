import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PayrollIntroScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Image
					source={require("../../assets/images/onboarding/logoAndPaycheck.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.content}>
				<Text style={styles.subtitle}>토스 딥링크를 이용해 더욱 편리한</Text>
				<Text style={styles.title}>임금송금 및 수령</Text>
				<Image
					source={require("../../assets/images/onboarding/payrollIntro_image.png")}
					style={styles.image}
					resizeMode="contain"
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
	},
	header: {
		paddingHorizontal: 40,
		paddingTop: 100,
		paddingBottom: 0,
		alignItems: "flex-start",
	},
	logo: {
		width: 220,
		height: 50,
	},
	content: {
		flex: 1,
		paddingHorizontal: 40,
		alignItems: "flex-start",
		justifyContent: "flex-start",
		paddingTop: 50,  
	},
	subtitle: {
		fontSize: 16, 
		color: "#848484",
		fontFamily: "Pretendard-SemiBold",
		textAlign: "left",
	},
	title: {
		fontSize: 40, 
		color: "#000000",
		fontFamily: "Pretendard-ExtraBold",
		textAlign: "left",
		lineHeight: 48,
		letterSpacing: -0.6,
	},
	image: {
		width: "115%", 
		flex: 1,
	},
});


export default PayrollIntroScreen;
