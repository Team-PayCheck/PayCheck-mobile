import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import type { PayrollDeductionType } from "../../../api/worker/types";

interface InsuranceToggleDisplayProps {
	payrollDeductionType: PayrollDeductionType;
}

const INSURANCE_ON_TYPES: PayrollDeductionType[] = [
	"PART_TIME_TAX_AND_INSURANCE",
];

const TAX_ON_TYPES: PayrollDeductionType[] = [
	"PART_TIME_TAX_ONLY",
	"PART_TIME_TAX_AND_INSURANCE",
	"FREELANCER",
];

const Toggle: React.FC<{ isOn: boolean }> = ({ isOn }) => (
	<View
		style={[
			styles.toggleTrack,
			{ backgroundColor: isOn ? colors.primary : colors.grey },
		]}
	>
		<View
			style={[
				styles.toggleThumb,
				isOn ? styles.thumbOn : styles.thumbOff,
			]}
		/>
	</View>
);

const InsuranceToggleDisplay: React.FC<InsuranceToggleDisplayProps> = ({
	payrollDeductionType,
}) => {
	const isInsuranceOn = INSURANCE_ON_TYPES.includes(payrollDeductionType);
	const isTaxOn = TAX_ON_TYPES.includes(payrollDeductionType);

	return (
		<View style={styles.container}>
			<View style={styles.toggleItem}>
				<Text style={styles.label} weight="Medium">
					4대보험
				</Text>
				<Toggle isOn={isInsuranceOn} />
			</View>
			<View style={styles.toggleItem}>
				<Text style={styles.label} weight="Medium">
					소득세
				</Text>
				<Toggle isOn={isTaxOn} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 24,
		marginVertical: 12,
	},
	toggleItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	toggleTrack: {
		width: 44,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		paddingHorizontal: 2,
	},
	toggleThumb: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: colors.white,
	},
	thumbOn: {
		alignSelf: "flex-end",
	},
	thumbOff: {
		alignSelf: "flex-start",
	},
});

export default InsuranceToggleDisplay;
