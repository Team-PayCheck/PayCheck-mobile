import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

interface ProfileCardProps {
	name: string;
	code: string;
	imageUri?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, code, imageUri }) => {
       return (
	       <View style={styles.container}>
		       <Image
			       source={
				       imageUri
					       ? { uri: imageUri }
					       : require("../../../assets/images/mypage/basicProfileImage.png")
			       }
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
		backgroundColor: colors.backgroundGrey,
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
