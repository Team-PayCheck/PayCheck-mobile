import { useState, useEffect } from "react";
import { getSalariesByYearMonth, getPaymentsByYearMonth } from "../../api/employer";
import type { SalaryPaymentItem } from "../../api/employer/types";

/**
 * 특정 근무자의 해당 월 급여 및 송금 상태를 관리하는 훅
 * - salaryPaymentItem: 순 급여 계산에 필요한 급여 데이터
 * - pendingPaymentId: 토스 송금 후 완료 처리 대기 중인 payment id
 * - isPaymentCompleted: 해당 월 송금 완료 여부
 */
const useRemittanceStatus = (
  workplaceId: number | null,
  workerName: string | null,
  year: number,
  month: number,
) => {
  const [salaryPaymentItem, setSalaryPaymentItem] = useState<SalaryPaymentItem | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<number | null>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  useEffect(() => {
    if (!workplaceId || !workerName) {
      setSalaryPaymentItem(null);
      setPendingPaymentId(null);
      setIsPaymentCompleted(false);
      return;
    }

    const fetch = async () => {
      try {
        const [salaryRes, paymentRes] = await Promise.all([
          getSalariesByYearMonth(workplaceId, year, month + 1),
          getPaymentsByYearMonth(workplaceId, year, month + 1),
        ]);

        const salaryItems = Array.isArray(salaryRes.data) ? salaryRes.data : [];
        setSalaryPaymentItem(
          salaryItems.find((item) => item.workerName === workerName) ?? null
        );

        const paymentItems = Array.isArray(paymentRes.data) ? paymentRes.data : [];
        const matchedPayment = paymentItems.find((p) => p.workerName === workerName) ?? null;
        if (matchedPayment?.isPaid) {
          setIsPaymentCompleted(true);
          setPendingPaymentId(null);
        } else {
          setIsPaymentCompleted(false);
          setPendingPaymentId(matchedPayment?.id ?? null);
        }
      } catch {
        setSalaryPaymentItem(null);
        setIsPaymentCompleted(false);
        setPendingPaymentId(null);
      }
    };

    fetch();
  }, [workplaceId, workerName, year, month]);

  return {
    salaryPaymentItem,
    pendingPaymentId,
    isPaymentCompleted,
    setPendingPaymentId,
    setIsPaymentCompleted,
  };
};

export default useRemittanceStatus;
