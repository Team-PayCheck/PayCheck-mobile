import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import BottomSheetModal from "../common/BottomSheetModal";
import PrimaryButton from "../common/PrimaryButton";
import { FormInput, PhoneInput } from "../signup";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";
import { useProfileEdit } from "../../hooks/worker/useProfileEdit";
import type { UserResponse } from "../../api/user/types";

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onSuccess: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  onClose,
  user,
  onSuccess,
}) => {
  const {
    name,
    phone,
    isSubmitting,
    setName,
    setPhone,
    handleSubmit,
    resetForm,
    isSubmitEnabled,
  } = useProfileEdit({ user, onSuccess, onClose });

  // 모달 열릴 때 현재 데이터로 초기화
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="85%" keyboardOffsetRatio={0.8}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text weight="ExtraBold" style={styles.title}>
          내 프로필 수정
        </Text>

        {/* 이름 */}
        <FormInput
          label="이름"
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요"
        />

        {/* 전화번호 */}
        <PhoneInput value={phone} onChangeText={setPhone} />

        {/* 수정 완료 버튼 */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            text={isSubmitting ? "수정 중..." : "수정 완료"}
            onPress={handleSubmit}
            disabled={!isSubmitEnabled}
          />
        </View>
      </ScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    gap: 24,
  },
  title: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: "center",
  },
  buttonSection: {
    alignItems: "center",
    marginTop: 8,
  },
});

export default ProfileEditModal;
