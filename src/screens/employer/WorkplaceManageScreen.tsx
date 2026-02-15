import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";

const WorkplaceManageScreen: React.FC = () => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text weight="Bold" style={styles.title}>
					근무지 관리
				</Text>
				<Text weight="Medium" style={styles.description}>
					근무지 관리 기능이 곧 추가될 예정입니다.
				</Text>
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
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		gap: 12,
	},
	title: {
		fontSize: 24,
		color: colors.textPrimary,
	},
	description: {
		fontSize: 14,
		color: colors.textSecondary,
		textAlign: "center",
	},
});

export default WorkplaceManageScreen;
