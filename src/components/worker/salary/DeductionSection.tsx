import React from "react";
import { View } from "react-native";
import { Text } from "../../common/Text";
import { formatCurrency } from "../../../utils/format";
import SalaryItemRow from "./SalaryItemRow";
import styles from "./salarySectionStyles";
import type { SalaryCalculateResponse } from "../../../api/worker/types";

interface DeductionSectionProps {
	salary: SalaryCalculateResponse | null;
}

const DeductionSection: React.FC<DeductionSectionProps> = ({ salary }) => {
	const totalDeduction = salary?.totalDeduction ?? null;

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
			<SalaryItemRow label="국민연금" value={salary?.nationalPension ?? null} />
			<SalaryItemRow label="고용보험" value={salary?.employmentInsurance ?? null} />
			<SalaryItemRow label="건강보험" value={salary?.healthInsurance ?? null} />
			<SalaryItemRow label="장기요양보험" value={salary?.longTermCare ?? null} />
			<View style={styles.divider} />
			<View style={styles.subtotalRow}>
				<Text style={styles.subtotalText} weight="SemiBold">
					공제액 계 :{" "}
					{totalDeduction !== null
						? `${formatCurrency(totalDeduction)}원`
						: "?"}
				</Text>
			</View>
		</View>
	);
};

export default DeductionSection;
