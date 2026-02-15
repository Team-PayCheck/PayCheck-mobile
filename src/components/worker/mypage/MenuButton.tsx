import React from "react";
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../common/Text";

interface MenuButtonProps {
	title: string;
	iconSource: ImageSourcePropType;
	onPress?: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, iconSource, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
			<View style={styles.iconCircle}>
				<Image
					source={iconSource}
					style={styles.iconImage}
					resizeMode="contain"
				/>
			</View>
			<Text weight="Bold" style={styles.title}>{title}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 239,
		height: 71,
		backgroundColor: "#FFFFFF",
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		flexDirection: "row",
		alignItems: "center",
		gap: 20,
		borderWidth: 1,
		borderColor: "#F0F0F0",
		shadowColor: "#000000",
		shadowOpacity: 0.06,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 6,
		elevation: 3,
	},
	iconCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#769fcd",
		alignItems: "center",
		justifyContent: "center",
	},
	iconImage: {
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 16,
		color: "#2F3135",
	},
});

export default MenuButton;
