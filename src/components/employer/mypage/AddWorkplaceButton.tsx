import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

interface AddWorkplaceButtonProps {
	onPress?: () => void;
}

const AddWorkplaceButton: React.FC<AddWorkplaceButtonProps> = ({ onPress }) => {
	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text weight="Medium" style={styles.text}>
				+ 새로운 근무지 추가하기
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 18,
		paddingVertical: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 15,
		color: colors.textMuted,
	},
});

export default AddWorkplaceButton;
