/**
 * 급여명세서 바텀시트 데이터 관리 훅.
 * 계약 목록 → 계약 상세(근무지명, payrollDeductionType) + 급여 계산을 병렬 호출하여
 * 근무지별 급여명세서 데이터를 구성.
 */
import { useState, useCallback } from "react";
import {
	getContracts,
	getContractDetail,
	calculateSalary,
} from "../../api/worker";
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
					const [detailRes, salaryRes] = await Promise.allSettled([
						getContractDetail(contract.id),
						calculateSalary(contract.id, year, month),
					]);

					const detail =
						detailRes.status === "fulfilled"
							? detailRes.value.data
							: null;
					const salary =
						salaryRes.status === "fulfilled"
							? salaryRes.value.data
							: null;

					return {
						contractId: contract.id,
						workplaceName:
							detail?.workplaceName ??
							contract.workplaceName ??
							"알 수 없음",
						payrollDeductionType:
							detail?.payrollDeductionType ?? "PART_TIME_NONE",
						salary: salary ?? null,
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
