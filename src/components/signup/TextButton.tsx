import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface TextButtonProps {
	text: string;
	onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({ text, onPress }) => {
	return (
		<TouchableOpacity
			style={styles.button}
			onPress={onPress}
			activeOpacity={0.6}
		>
			<Text weight="Medium" style={styles.text}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	text: {
		fontSize: 14,
		color: colors.textMuted,
		textAlign: "center",
	},
});

export default TextButton;
