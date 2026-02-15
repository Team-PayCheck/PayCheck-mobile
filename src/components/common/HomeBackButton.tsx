import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";

interface HomeBackButtonProps {
	onPress: () => void;
}

const HomeBackButton: React.FC<HomeBackButtonProps> = ({ onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
			<View style={styles.row}>
				<Ionicons name="chevron-back" size={24} color="#000000" />
				<Text weight="Bold" style={styles.text}>홈</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchable: {
		alignSelf: "flex-start",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2,
	},
	text: {
		fontSize: 16,
		color: "#000000",
	},
});

export default HomeBackButton;
