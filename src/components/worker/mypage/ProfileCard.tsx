import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";

interface ProfileCardProps {
	name: string;
	code: string;
	imageUri?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, code, imageUri }) => {
	return (
		<View style={styles.container}>
			<Image
				source={{
					uri:
						imageUri ??
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
				}}
				style={styles.profileImage}
			/>
			<Text weight="SemiBold" style={styles.name}>{name}</Text>
			<Text weight="SemiBold" style={styles.code}>{code}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 5,
	},
	profileImage: {
		width: 45,
		height: 45,
		borderRadius: 22.5,
		backgroundColor: "#D9D9D9",
	},
	name: {
		fontSize: 24,
		color: "#000000",
        paddingTop: 5,
	},
	code: {
		fontSize: 14,
		color: "#848484",
	},
});

export default ProfileCard;
