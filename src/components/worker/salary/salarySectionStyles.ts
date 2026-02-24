import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

const salarySectionStyles = StyleSheet.create({
	container: {
		marginTop: 16,
	},
	title: {
		fontSize: 16,
		color: colors.textPrimary,
		marginBottom: 8,
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: 4,
	},
	subtotalRow: {
		alignItems: "flex-end",
		marginTop: 8,
	},
	subtotalText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
});

export default salarySectionStyles;
