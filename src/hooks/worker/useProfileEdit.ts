import { useState } from "react";
import { updateUserProfile } from "../../api/user";
import { pickProfileImage } from "../../utils/image";
import { showSuccess, showError } from "../../utils/alert";
import type { UserResponse, UserUpdateRequest } from "../../api/user/types";

interface UseProfileEditParams {
  user: UserResponse | null;
  onSuccess: () => void;
  onClose: () => void;
}

interface UseProfileEditReturn {
  // 폼 상태
  name: string;
  phone: string;
  imageUri: string | null;
  isSubmitting: boolean;

  // 액션
  setName: (text: string) => void;
  setPhone: (text: string) => void;
  handleImagePress: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;

  // 유효성
  isNameValid: boolean;
  isPhoneValid: boolean;
  hasChanges: boolean;
  isSubmitEnabled: boolean;
}

/**
 * 프로필 수정 커스텀 훅
 * - PUT /api/users/me API 호출
 * - 폼 상태 관리 + 유효성 검사 + 이미지 선택
 */
export function useProfileEdit({ user, onSuccess, onClose }: UseProfileEditParams): UseProfileEditReturn {
  const [name, setNameRaw] = useState("");
  const [phone, setPhone] = useState("--");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이름 입력 (한글/영문만, 최대 50자)
  const setName = (text: string) => {
    const filtered = text.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "").slice(0, 50);
    setNameRaw(filtered);
  };

  // 현재 user 데이터로 폼 초기화
  const resetForm = () => {
    if (user) {
      setNameRaw(user.name);
      setPhone(user.phone);
      setImageUri(user.profileImageUrl);
      setImageBase64(null);
    }
  };

  // 이미지 선택
  const handleImagePress = async () => {
    const result = await pickProfileImage();
    if (result) {
      setImageUri(result.uri);
      setImageBase64(result.base64);
    }
  };

  // 유효성 검사
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 50;
  const isPhoneValid = /^01\d-\d{4}-\d{4}$/.test(phone);

  const hasChanges = !!user && (
    name !== user.name ||
    phone !== user.phone ||
    imageBase64 !== null
  );

  const isSubmitEnabled = isNameValid && isPhoneValid && hasChanges && !isSubmitting;

  // 수정 완료
  const handleSubmit = async () => {
    if (!isSubmitEnabled || !user) return;

    setIsSubmitting(true);
    try {
      const updateData: UserUpdateRequest = {};

      if (name !== user.name) updateData.name = name;
      if (phone !== user.phone) updateData.phone = phone;
      if (imageBase64) updateData.profileImageUrl = imageBase64;

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
    phone,
    imageUri,
    isSubmitting,
    setName,
    setPhone,
    handleImagePress,
    handleSubmit,
    resetForm,
    isNameValid,
    isPhoneValid,
    hasChanges,
    isSubmitEnabled,
  };
}
