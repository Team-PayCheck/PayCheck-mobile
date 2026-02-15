import React from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface ProfileImagePickerProps {
	imageUri?: string | null;
	onPress: () => void;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
	imageUri,
	onPress,
}) => {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<View style={styles.imageContainer}>
				{imageUri ? (
					<Image source={{ uri: imageUri }} style={styles.image} />
				) : (
					<View style={styles.placeholder} />
				)}
			</View>
			<View style={styles.cameraButton}>
				<Ionicons name="camera-outline" size={20} color={colors.textPrimary} />
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "relative",
		width: 140,
		height: 140,
	},
	imageContainer: {
		width: 140,
		height: 140,
		borderRadius: 70,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	placeholder: {
		width: "100%",
		height: "100%",
		backgroundColor: colors.grey,
	},
	cameraButton: {
		position: "absolute",
		bottom: 4,
		right: 4,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.white,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: colors.border,
	},
});

export default ProfileImagePicker;
