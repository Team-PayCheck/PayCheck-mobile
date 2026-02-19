import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import BottomSheetModal from "../common/BottomSheetModal";
import PrimaryButton from "../common/PrimaryButton";
import { FormInput, BankSelectModal } from "../signup";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";
import { useAccountEdit } from "../../hooks/worker/useAccountEdit";
import type { WorkerResponse } from "../../api/user/types";
import type { BankName } from "../../constants/bank";

interface AccountEditModalProps {
  visible: boolean;
  onClose: () => void;
  worker: WorkerResponse | null;
  onSuccess: () => void;
}

const AccountEditModal: React.FC<AccountEditModalProps> = ({
  visible,
  onClose,
  worker,
  onSuccess,
}) => {
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);

  const {
    bankName,
    accountNumber,
    isSubmitting,
    setBankName,
    setAccountNumber,
    handleSubmit,
    resetForm,
    isSubmitEnabled,
  } = useAccountEdit({ worker, onSuccess, onClose });

  // 모달 열릴 때 현재 데이터로 초기화
  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  const handleBankSelect = (selected: BankName) => {
    setBankName(selected);
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose} maxHeight="60%">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text weight="ExtraBold" style={styles.title}>
          급여 계좌 수정
        </Text>

        {/* 은행명 */}
        <FormInput
          label="은행명"
          value={bankName}
          placeholder="은행을 선택하세요"
          onPress={() => setIsBankModalVisible(true)}
          showChevron
        />

        {/* 계좌번호 */}
        <FormInput
          label="계좌번호"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="계좌번호를 입력하세요 (8~16자리)"
          keyboardType="number-pad"
        />

        {/* 수정 완료 버튼 */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            text={isSubmitting ? "수정 중..." : "수정 완료"}
            onPress={handleSubmit}
            disabled={!isSubmitEnabled}
          />
        </View>
      </ScrollView>

      <BankSelectModal
        visible={isBankModalVisible}
        onClose={() => setIsBankModalVisible(false)}
        onSelect={handleBankSelect}
        selectedBank={bankName}
      />
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

export default AccountEditModal;
