import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";

interface SmallActionButtonProps {
	text: string;
	onPress?: () => void;
}

const SmallActionButton: React.FC<SmallActionButtonProps> = ({ text, onPress }) => {
	return (
		<TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
			<Text weight="Bold" style={styles.text}>{text}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 114,
		height: 71,
		backgroundColor: "#FFFFFF",
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#F0F0F0",
		shadowColor: "#000000",
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
		elevation: 3,
	},
	text: {
		fontSize: 18,
		color: "#353535",
		textAlign: "center",
	},
});

export default SmallActionButton;
