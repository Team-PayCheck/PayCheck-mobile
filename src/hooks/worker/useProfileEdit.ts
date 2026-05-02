import { useState } from "react";
import { updateUserProfile } from "../../api/user";
import { showSuccess, showError } from "../../utils/alert";
import type { UserResponse, UserUpdateRequest } from "../../api/user/types";

interface UseProfileEditParams {
  user: UserResponse | null;
  onSuccess: () => void;
  onClose: () => void;
}

interface UseProfileEditReturn {
  name: string;
  phone: string;
  isSubmitting: boolean;
  setName: (text: string) => void;
  setPhone: (text: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
  isNameValid: boolean;
  isPhoneValid: boolean;
  hasChanges: boolean;
  isSubmitEnabled: boolean;
}

/**
 * 프로필 수정 커스텀 훅
 * - PUT /api/users/me API 호출
 * - 폼 상태 관리 + 유효성 검사 (이름, 전화번호)
 */
export function useProfileEdit({ user, onSuccess, onClose }: UseProfileEditParams): UseProfileEditReturn {
  const [name, setNameRaw] = useState("");
  const [phoneValue, setPhoneValue] = useState("--");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setName = (text: string) => {
    const filtered = text.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "").slice(0, 50);
    setNameRaw(filtered);
  };

  const setPhone = (text: string) => {
    setPhoneValue(text);
  };

  const resetForm = () => {
    if (user) {
      setNameRaw(user.name);
      setPhoneValue(user.phone);
    }
  };

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 50;
  const isPhoneValid = /^01\d-\d{4}-\d{4}$/.test(phoneValue);

  const hasChanges = !!user && (
    name !== user.name ||
    phoneValue !== user.phone
  );

  const isSubmitEnabled = isNameValid && isPhoneValid && hasChanges && !isSubmitting;

  const handleSubmit = async () => {
    if (!isSubmitEnabled || !user) return;

    setIsSubmitting(true);
    try {
      const updateData: UserUpdateRequest = {};

      if (name !== user.name) updateData.name = name;
      if (phoneValue !== user.phone) updateData.phone = phoneValue;

      const response = await updateUserProfile(updateData);

      if (response.success) {
        showSuccess("프로필이 수정되었습니다.");
        onSuccess();
        onClose();
      } else {
        showError("수정 실패", "프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      showError("수정 실패", "프로필 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    phone: phoneValue,
    isSubmitting,
    setName,
    setPhone,
    handleSubmit,
    resetForm,
    isNameValid,
    isPhoneValid,
    hasChanges,
    isSubmitEnabled,
  };
}
