import { useState } from "react";
import { updateAccountInfo } from "../../api/user";
import { showSuccess, showError } from "../../utils/alert";
import type { WorkerResponse, WorkerUpdateRequest } from "../../api/user/types";

interface UseAccountEditParams {
  worker: WorkerResponse | null;
  onSuccess: () => void;
  onClose: () => void;
}

interface UseAccountEditReturn {
  // 폼 상태
  bankName: string;
  accountNumber: string;
  isSubmitting: boolean;

  // 액션
  setBankName: (name: string) => void;
  setAccountNumber: (text: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;

  // 유효성
  isAccountNumberValid: boolean;
  hasChanges: boolean;
  isSubmitEnabled: boolean;
}

/**
 * 계좌 정보 수정 커스텀 훅
 * - PUT /api/users/me/account API 호출
 * - 폼 상태 관리 + 유효성 검사
 */
export function useAccountEdit({ worker, onSuccess, onClose }: UseAccountEditParams): UseAccountEditReturn {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumberRaw] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 계좌번호 입력 (숫자만, 최대 16자리)
  const setAccountNumber = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 16);
    setAccountNumberRaw(digits);
  };

  // 현재 worker 데이터로 폼 초기화
  const resetForm = () => {
    if (worker) {
      setBankName(worker.bankName);
      setAccountNumberRaw(worker.accountNumber);
    }
  };

  // 유효성 검사
  const isAccountNumberValid = accountNumber.length >= 8 && accountNumber.length <= 16;

  const hasChanges = !!worker && (
    bankName !== worker.bankName ||
    accountNumber !== worker.accountNumber
  );

  const isSubmitEnabled = bankName.length > 0 && isAccountNumberValid && hasChanges && !isSubmitting;

  // 수정 완료
  const handleSubmit = async () => {
    if (!isSubmitEnabled || !worker) return;

    setIsSubmitting(true);
    try {
      const updateData: WorkerUpdateRequest = {
        bankName,
        accountNumber,
      };

      const response = await updateAccountInfo(updateData);

      if (response.success) {
        showSuccess("계좌 정보가 수정되었습니다.");
        onSuccess();
        onClose();
      } else {
        showError("수정 실패", "계좌 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("계좌 정보 수정 실패:", error);
      showError("수정 실패", "계좌 정보 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bankName,
    accountNumber,
    isSubmitting,
    setBankName,
    setAccountNumber,
    handleSubmit,
    resetForm,
    isAccountNumberValid,
    hasChanges,
    isSubmitEnabled,
  };
}
