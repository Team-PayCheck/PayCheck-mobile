import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

interface ProfileCardProps {
	name: string;
	code?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, code }) => {
	const initial = name ? name.charAt(0) : "?";
	return (
		<View style={styles.container}>
			<View style={styles.avatar}>
				<Text weight="Bold" style={styles.initial}>{initial}</Text>
			</View>
			<Text weight="SemiBold" style={styles.name}>{name}</Text>
			{code ? <Text weight="SemiBold" style={styles.code}>{code}</Text> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 5,
	},
	avatar: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		backgroundColor: colors.primaryLight,
		alignItems: "center",
		justifyContent: "center",
	},
	initial: {
		fontSize: 18,
		color: colors.primary,
	},
	name: {
		fontSize: 24,
		color: colors.textPrimary,
		paddingTop: 5,
	},
	code: {
		fontSize: 14,
		color: colors.textSecondary,
	},
});

export default ProfileCard;
