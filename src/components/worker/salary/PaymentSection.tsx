import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import SalaryItemRow from "./SalaryItemRow";
import type { SalaryCalculateResponse } from "../../../api/worker/types";

interface PaymentSectionProps {
	salary: SalaryCalculateResponse | null;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ salary }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title} weight="SemiBold">
				지급
			</Text>
			<View style={styles.divider} />
			<SalaryItemRow label="기본급여" value={salary?.basePay ?? null} />
			<SalaryItemRow
				label="연장근로수당"
				value={salary?.overtimePay ?? null}
			/>
			<SalaryItemRow
				label="야간근로수당"
				value={salary?.nightPay ?? null}
			/>
			<SalaryItemRow
				label="휴일근로수당"
				value={salary?.holidayPay ?? null}
			/>
			<SalaryItemRow label="가족수당" value={null} />
			<View style={styles.divider} />
			<View style={styles.subtotalRow}>
				<Text style={styles.subtotalText} weight="SemiBold">
					지급액 계 :{" "}
					{salary?.totalGrossPay !== undefined
						? `${formatCurrency(salary.totalGrossPay)}원`
						: "?"}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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

export default PaymentSection;
