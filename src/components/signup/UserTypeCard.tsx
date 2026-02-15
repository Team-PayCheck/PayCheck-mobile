import React from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";
import type { UserType } from "../../types/signup.types";

interface UserTypeCardProps {
	type: UserType;
	selected: boolean;
	onPress: () => void;
}

const UserTypeCard: React.FC<UserTypeCardProps> = ({
	type,
	selected,
	onPress,
}) => {
	const isWorker = type === "WORKER";
	const label = isWorker ? "알바생" : "사장님";
	const icon = isWorker
		? require("../../assets/images/signup/worker-icon.png")
		: require("../../assets/images/signup/employer-icon.png");

	return (
		<TouchableOpacity
			style={[styles.card, selected && styles.cardSelected]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View style={styles.iconContainer}>
				<Image source={icon} style={styles.icon} resizeMode="contain" />
			</View>
			<Text weight="SemiBold" style={styles.label}>
				{label}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		width: 150,
		height: 170,
		backgroundColor: colors.white,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
	},
	cardSelected: {
		borderColor: colors.primary,
		borderWidth: 2,
	},
	iconContainer: {
		width: 100,
		height: 100,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		width: 160,
		height: 160,
	},
	label: {
		fontSize: 16,
		color: colors.textPrimary,
	},
});

export default UserTypeCard;
