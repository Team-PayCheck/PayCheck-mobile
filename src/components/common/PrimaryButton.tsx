import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
			<Text style={styles.buttonText}>{text}</Text>
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
		fontFamily: "Pretendard-Bold",
		textAlign: "center",
	},
});

export default PrimaryButton;
