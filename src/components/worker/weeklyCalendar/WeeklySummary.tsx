import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import type { WeeklySummaryData } from "../../../types/worker.types";

interface WeeklySummaryProps {
	summary: WeeklySummaryData;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Text weight="Medium" style={styles.label}>
					{summary.weekLabel} 총 근무시간
				</Text>
				<Text weight="Bold" style={styles.value}>
					{summary.totalHours}시간
				</Text>
			</View>
			<View style={styles.row}>
				<Text weight="Medium" style={styles.label}>
					이번 주 예상 근무비
				</Text>
				<Text weight="Bold" style={styles.value}>
					{formatCurrency(summary.estimatedPay)}원
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	row: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 16,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	value: {
		fontSize: 20,
		color: colors.textPrimary,
	},
});

export default WeeklySummary;
