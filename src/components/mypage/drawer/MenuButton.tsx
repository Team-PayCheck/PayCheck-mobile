import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

interface MenuButtonProps {
	title: string;
	iconSource?: ImageSourcePropType;
	iconName?: keyof typeof Ionicons.glyphMap;
	iconImageSize?: number;
	onPress?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, iconSource, iconName, iconImageSize, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
			<View style={styles.iconCircle}>
				{iconSource ? (
					<Image
						source={iconSource}
						style={[styles.iconImage, iconImageSize != null && { width: iconImageSize, height: iconImageSize }]}
						resizeMode="contain"
					/>
				) : iconName ? (
					<Ionicons name={iconName} size={28} color={colors.primary} />
				) : null}
			</View>
			<Text weight="Bold" style={styles.title}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 239,
		height: 71,
		backgroundColor: colors.white,
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
		borderWidth: 1,
		borderColor: colors.borderLight,
		shadowColor: colors.black,
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
		elevation: 3,
	},
	iconCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
	},
	iconImage: {
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 16,
		color: colors.textPrimary,
	},
});

export default MenuButton;
