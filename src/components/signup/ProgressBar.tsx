import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

interface ProgressBarProps {
	currentStep: number;
	totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	currentStep,
	totalSteps,
}) => {
	const progress = (currentStep / totalSteps) * 100;

	return (
		<View style={styles.container}>
			<View style={styles.track}>
				<View style={[styles.fill, { width: `${progress}%` }]} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		paddingHorizontal: 60,
	},
	track: {
		height: 6,
		backgroundColor: colors.border,
		borderRadius: 3,
		overflow: "hidden",
	},
	fill: {
		height: "100%",
		backgroundColor: colors.primary,
		borderRadius: 3,
	},
});

export default ProgressBar;
