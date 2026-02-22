/**
 * 송금 내역 + 급여 상세 조회 훅.
 * getPayments()로 전체 송금 내역을 가져온 뒤,
 * year/month로 필터링하고 각 salaryId로 급여 상세를 조회하여
 * 근무지별 급여 + 송금 상태 데이터를 반환.
 */
import { useState, useEffect, useCallback } from "react";
import { getPayments, getSalaryDetail } from "../../api/worker";
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
			const paymentsRes = await getPayments();
			const allPayments = paymentsRes.data ?? [];

			// 해당 월 필터링
			const filtered = allPayments.filter(
				(p) => p.year === year && p.month === month
			);

			// 각 payment의 salaryId로 급여 상세 조회
			const results = await Promise.all(
				filtered.map(async (payment) => {
					try {
						const salaryRes = await getSalaryDetail(payment.salaryId);
						const salary = salaryRes.data;
						if (!salary) return null;
						return {
							workplaceName: salary.workplaceName,
							baseSalary: salary.totalGrossPay,
							deduction: salary.totalDeduction,
							maxSalary: salary.netPay,
							status: STATUS_LABEL[payment.status],
						};
					} catch {
						return null;
					}
				})
			);

			setWorkplaces(results.filter((r): r is WorkplaceSalaryItem => r !== null));
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
