import React from "react";
import { View } from "react-native";
import { Text } from "../../common/Text";
import { formatCurrency } from "../../../utils/format";
import SalaryItemRow from "./SalaryItemRow";
import styles from "./salarySectionStyles";
import type { SalaryCalculateResponse } from "../../../api/worker/types";

interface PaymentSectionProps {
	salary: SalaryCalculateResponse | null;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ salary }) => {
	const totalGrossPay = salary?.totalGrossPay ?? null;

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
			<View style={styles.divider} />
			<View style={styles.subtotalRow}>
				<Text style={styles.subtotalText} weight="SemiBold">
					지급액 계 :{" "}
					{totalGrossPay !== null
						? `${formatCurrency(totalGrossPay)}원`
						: "?"}
				</Text>
			</View>
		</View>
	);
};

export default PaymentSection;
