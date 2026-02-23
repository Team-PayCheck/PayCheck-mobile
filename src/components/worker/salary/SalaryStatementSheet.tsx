import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import BottomSheetModal from "../../common/BottomSheetModal";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import useSalaryStatement from "../../../hooks/worker/useSalaryStatement";
import WorkplaceTabSelector from "./WorkplaceTabSelector";
import InsuranceToggleDisplay from "./InsuranceToggleDisplay";
import PaymentSection from "./PaymentSection";
import DeductionSection from "./DeductionSection";

interface SalaryStatementSheetProps {
	visible: boolean;
	onClose: () => void;
	year: number;
	month: number;
}

const SalaryStatementSheet: React.FC<SalaryStatementSheetProps> = ({
	visible,
	onClose,
	year,
	month,
}) => {
	const {
		statements,
		isLoading,
		selectedIndex,
		setSelectedIndex,
		fetchStatements,
	} = useSalaryStatement(year, month);

	useEffect(() => {
		if (visible) {
			fetchStatements();
		}
	}, [visible]);

	const currentStatement = statements[selectedIndex];
	const workplaceNames = statements.map((s) => s.workplaceName);

	return (
		<BottomSheetModal visible={visible} onClose={onClose} maxHeight="95%">
			{isLoading ? (
				<ActivityIndicator
					size="large"
					color={colors.primary}
					style={styles.loader}
				/>
			) : statements.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						급여 데이터가 없습니다
					</Text>
				</View>
			) : (
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					<Text style={styles.title} weight="Bold">
						급여명세서
					</Text>

					<WorkplaceTabSelector
						workplaceNames={workplaceNames}
						selectedIndex={selectedIndex}
						onSelect={setSelectedIndex}
					/>

					<Text style={styles.workplaceName} weight="Bold">
						{currentStatement.workplaceName}
					</Text>

					<InsuranceToggleDisplay
						payrollDeductionType={
							currentStatement.payrollDeductionType
						}
					/>

					<PaymentSection salary={currentStatement.salary} />
					<DeductionSection salary={currentStatement.salary} />

					<View style={styles.netPayContainer}>
						<Text style={styles.netPayText} weight="Bold">
							실 수령액 :{" "}
							{currentStatement.salary?.netPay !== undefined
								? `${formatCurrency(currentStatement.salary.netPay)}원`
								: "?"}
						</Text>
					</View>
				</ScrollView>
			)}
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	loader: {
		paddingVertical: 60,
	},
	emptyContainer: {
		paddingVertical: 60,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	scrollContent: {
		paddingBottom: 20,
	},
	title: {
		fontSize: 22,
		color: colors.textPrimary,
		marginBottom: 20,
	},
	workplaceName: {
		fontSize: 18,
		color: colors.textPrimary,
		marginTop: 16,
	},
	netPayContainer: {
		alignItems: "center",
		marginTop: 28,
		paddingVertical: 16,
		backgroundColor: colors.backgroundGrey,
		borderRadius: 12,
	},
	netPayText: {
		fontSize: 20,
		color: colors.textPrimary,
	},
});

export default SalaryStatementSheet;
