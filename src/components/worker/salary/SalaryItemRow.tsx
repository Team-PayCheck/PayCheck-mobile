import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";

interface SalaryItemRowProps {
	label: string;
	value: number | null;
}

const SalaryItemRow: React.FC<SalaryItemRowProps> = ({ label, value }) => {
	return (
		<View style={styles.row}>
			<Text style={styles.label}>{label}</Text>
			<Text style={styles.value}>
				{value !== null ? formatCurrency(value) : "?"}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	label: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	value: {
		fontSize: 14,
		color: colors.textPrimary,
	},
});

export default SalaryItemRow;
