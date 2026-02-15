import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { colors } from "../../constants/colors";

interface PrimaryButtonProps {
	text: string;
	onPress?: () => void;
	disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	text,
	onPress,
	disabled = false,
}) => {
	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.buttonDisabled]}
			onPress={onPress}
			activeOpacity={0.8}
			disabled={disabled}
		>
			<Text weight="Bold" style={styles.buttonText}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 80,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDisabled: {
		backgroundColor: colors.disabled,
	},
	buttonText: {
		fontSize: 14,
		color: colors.white,
		textAlign: "center",
	},
});

export default PrimaryButton;
