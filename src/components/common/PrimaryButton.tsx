import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { colors } from "../../constants/colors";

interface PrimaryButtonProps {
	text: string;
	onPress?: () => void;
	disabled?: boolean;
	icon?: React.ReactNode;
	size?: "default" | "compact";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	text,
	onPress,
	disabled = false,
	icon,
	size = "default",
}) => {
	const isCompact = size === "compact";

	return (
		<TouchableOpacity
			style={[
				styles.button,
				isCompact && styles.buttonCompact,
				disabled && styles.buttonDisabled,
			]}
			onPress={onPress}
			activeOpacity={0.8}
			disabled={disabled}
		>
			{icon}
			<Text weight="Bold" style={[styles.buttonText, isCompact && styles.buttonTextCompact]}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		flexDirection: "row",
		backgroundColor: colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 80,
		borderRadius: 50,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	buttonCompact: {
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 28,
	},
	buttonDisabled: {
		backgroundColor: colors.disabled,
	},
	buttonText: {
		fontSize: 14,
		color: colors.white,
		textAlign: "center",
	},
	buttonTextCompact: {
		fontSize: 15,
	},
});

export default PrimaryButton;
