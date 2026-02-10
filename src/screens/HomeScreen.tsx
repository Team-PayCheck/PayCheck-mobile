import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>PayCheck</Text>
				<Text style={styles.subtitle}>임시화면_로그인 완료</Text>
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
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	title: {
		fontSize: 28,
		color: "#111111",
		fontFamily: "Pretendard-Bold",
	},
	subtitle: {
		fontSize: 14,
		color: "#777777",
		fontFamily: "Pretendard-Medium",
	},
});

export default HomeScreen;
