/**
 * 급여명세서 바텀시트 데이터 관리 훅.
 * 계약 목록 응답에서 근무지명, payrollDeductionType을 직접 사용하고
 * 급여 계산만 병렬 호출하여 근무지별 급여명세서 데이터를 구성.
 */
import { useState, useCallback } from "react";
import { getContracts, calculateSalary } from "../../api/worker";
import type {
	PayrollDeductionType,
	SalaryCalculateResponse,
} from "../../api/worker/types";

export interface SalaryStatementData {
	contractId: number;
	workplaceName: string;
	payrollDeductionType: PayrollDeductionType;
	salary: SalaryCalculateResponse | null;
}

const useSalaryStatement = (year: number, month: number) => {
	const [statements, setStatements] = useState<SalaryStatementData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const fetchStatements = useCallback(async () => {
		setIsLoading(true);
		try {
			const contractsRes = await getContracts();
			const activeContracts =
				contractsRes.data?.filter((c) => c.isActive) ?? [];

			const results = await Promise.all(
				activeContracts.map(async (contract) => {
					let salary: SalaryCalculateResponse | null = null;
					try {
						const salaryRes = await calculateSalary(
							contract.id,
							year,
							month
						);
						salary = salaryRes.data ?? null;
					} catch {
						// 급여 계산 실패 시 null
					}

					return {
						contractId: contract.id,
						workplaceName: contract.workplaceName,
						payrollDeductionType: contract.payrollDeductionType,
						salary,
					};
				})
			);

			setStatements(results);
			setSelectedIndex(0);
		} catch {
			setStatements([]);
		} finally {
			setIsLoading(false);
		}
	}, [year, month]);

	return {
		statements,
		isLoading,
		selectedIndex,
		setSelectedIndex,
		fetchStatements,
	};
};

export default useSalaryStatement;
