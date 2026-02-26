/**
 * 마이페이지 서브 화면에서 홈으로 돌아가는 뒤로가기 버튼.
 */
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "../../constants/colors";

interface HomeBackButtonProps {
	onPress: () => void;
}

const HomeBackButton: React.FC<HomeBackButtonProps> = ({ onPress }) => {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
			<View style={styles.row}>
				<Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
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
		color: colors.textPrimary,
	},
});

export default HomeBackButton;
