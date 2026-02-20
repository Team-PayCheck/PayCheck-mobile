import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";

const EmployerHomeScreen: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text weight="Bold" style={styles.title}>고용주홈</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		color: colors.textPrimary,
	},
});

export default EmployerHomeScreen;
