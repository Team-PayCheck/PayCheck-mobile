import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

interface HeaderProps {
	onPressLeft?: () => void;
	onPressRight?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressLeft, onPressRight }) => {
	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={onPressLeft} activeOpacity={0.8}>
				<Feather name="align-left" size={28} color="#111111" />
			</TouchableOpacity>
			<TouchableOpacity onPress={onPressRight} activeOpacity={0.8}>
				<Ionicons name="notifications-outline" size={28} color="#111111" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		paddingTop: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});

export default Header;
