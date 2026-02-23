import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import SalaryItemRow from "./SalaryItemRow";
import type { SalaryCalculateResponse } from "../../../api/worker/types";

interface DeductionSectionProps {
	salary: SalaryCalculateResponse | null;
}

const DeductionSection: React.FC<DeductionSectionProps> = ({ salary }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.title} weight="SemiBold">
				공제
			</Text>
			<View style={styles.divider} />
			<SalaryItemRow label="소득세" value={salary?.incomeTax ?? null} />
			<SalaryItemRow
				label="지방소득세"
				value={salary?.localIncomeTax ?? null}
			/>
			{/* 4대보험 개별 항목: 백엔드에서 개별 필드 추가 전까지 ? 표시 */}
			<SalaryItemRow label="국민연금" value={null} />
			<SalaryItemRow label="고용보험" value={null} />
			<SalaryItemRow label="건강보험" value={null} />
			<SalaryItemRow label="장기요양보험" value={null} />
			<SalaryItemRow label="노동조합비" value={null} />
			<View style={styles.divider} />
			<View style={styles.subtotalRow}>
				<Text style={styles.subtotalText} weight="SemiBold">
					공제액 계 :{" "}
					{salary?.totalDeduction !== undefined
						? `${formatCurrency(salary.totalDeduction)}원`
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

export default DeductionSection;
