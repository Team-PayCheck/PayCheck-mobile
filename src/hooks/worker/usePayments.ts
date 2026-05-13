/**
 * 근무지별 월간 급여 요약 훅.
 * 활성 계약 목록을 가져온 뒤 각 계약에 대해 calculateSalary를 호출하여
 * WorkplaceSalarySummary에서 사용할 데이터를 반환한다.
 * paymentStatus가 응답에 포함된 경우 한글 라벨로 변환하여 표시한다.
 */
import { useState, useEffect, useCallback } from "react";
import { getContracts, calculateSalary } from "../../api/worker";
import type { PaymentStatus } from "../../api/worker/types";

const STATUS_LABEL: Record<PaymentStatus, string> = {
	PENDING: "송금 대기중",
	COMPLETED: "송금완료",
	FAILED: "송금 실패",
};

export interface WorkplaceSalaryItem {
	workplaceName: string;
	baseSalary: number;
	deduction: number;
	maxSalary: number;
	status: string;
}

const usePayments = (year: number, month: number) => {
	const [workplaces, setWorkplaces] = useState<WorkplaceSalaryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchPayments = useCallback(async () => {
		try {
			setIsLoading(true);
			const contractsRes = await getContracts();
			const activeContracts =
				contractsRes.data?.filter((c) => c.isActive) ?? [];

			const results = await Promise.all(
				activeContracts.map(async (contract) => {
					try {
						const salaryRes = await calculateSalary(
							contract.id,
							year,
							month
						);
						const salary = salaryRes.data;
						if (!salary) return null;

						const statusKey = salary.paymentStatus as PaymentStatus | undefined;
						const statusLabel =
							statusKey && statusKey in STATUS_LABEL
								? STATUS_LABEL[statusKey]
								: "송금 대기중";

						return {
							workplaceName: contract.workplaceName,
							baseSalary: salary.totalGrossPay,
							deduction: salary.totalDeduction,
							maxSalary: salary.netPay,
							status: statusLabel,
						};
					} catch {
						return null;
					}
				})
			);

			setWorkplaces(
				results.filter((r): r is WorkplaceSalaryItem => r !== null)
			);
		} catch {
			setWorkplaces([]);
		} finally {
			setIsLoading(false);
		}
	}, [year, month]);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	return { workplaces, isLoading, refetch: fetchPayments };
};

export default usePayments;
