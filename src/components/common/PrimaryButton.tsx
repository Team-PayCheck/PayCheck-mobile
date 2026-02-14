import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Text";

interface PrimaryButtonProps {
	text: string;
	onPress?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ text, onPress }) => {
	return (
		<TouchableOpacity
			style={styles.button}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Text weight="Bold" style={styles.buttonText}>{text}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#0158CC",
		paddingVertical: 12,
		paddingHorizontal: 80,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontSize: 14,
		color: "#ffffff",
		textAlign: "center",
	},
});

export default PrimaryButton;
