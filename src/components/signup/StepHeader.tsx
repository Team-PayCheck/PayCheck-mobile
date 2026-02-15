import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface StepHeaderProps {
	step: number;
	totalSteps: number;
	title: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ step, totalSteps, title }) => {
	return (
		<View style={styles.container}>
			<Text weight="Bold" style={styles.stepText}>
				STEP {step}/{totalSteps}
			</Text>
			<Text weight="Bold" style={styles.title}>
				{title}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		gap: 8,
	},
	stepText: {
		fontSize: 14,
		color: colors.primary,
		textDecorationLine: "underline",
	},
	title: {
		fontSize: 20,
		color: colors.textPrimary,
	},
});

export default StepHeader;
