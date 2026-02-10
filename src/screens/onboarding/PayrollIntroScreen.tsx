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
					source={require("../../assets/images/onboarding/payrollIntro_Image.png")}
					style={styles.image}
					resizeMode="contain"
				/>
				<View style={styles.indicatorRow}>
					<View style={[styles.indicatorDot, styles.indicatorActive]} />
					<View style={styles.indicatorDot} />
					<View style={styles.indicatorDot} />
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 8,
		alignItems: "center",
	},
	logo: {
		width: 200,
		height: 40,
	},
	content: {
		flex: 1,
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 24,
	},
	subtitle: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
		textAlign: "center",
	},
	title: {
		marginTop: 8,
		fontSize: 28,
		color: "#111827",
		fontWeight: "700",
		textAlign: "center",
	},
	image: {
		marginTop: 24,
		width: "100%",
		height: 360,
	},
	indicatorRow: {
		marginTop: 24,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	indicatorDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "#d1d5db",
	},
	indicatorActive: {
		backgroundColor: "#111827",
	},
});

export default PayrollIntroScreen;
