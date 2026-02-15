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
				<Ionicons name="chevron-back" size={20} color="#222222" />
				<Text weight="Medium" style={styles.text}>홈</Text>
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
		gap: 1,
	},
	text: {
		fontSize: 17,
		color: "#222222",
	},
});

export default HomeBackButton;
