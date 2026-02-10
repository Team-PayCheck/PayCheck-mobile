import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NoticeIntroScreen = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>공지게시판</Text>
				<Text style={styles.subtitle}>고용주와 근로자의 소통을 원활하게 하는</Text>
				<Image
					source={require("../../assets/images/onboarding/noticeIntro_image.png")}
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
	content: {
		flex: 1,
		paddingHorizontal: 40,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 24,
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

export default NoticeIntroScreen;
