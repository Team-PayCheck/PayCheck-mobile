import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
} from "react-native";
import BottomSheetModal from "../../common/BottomSheetModal";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { createWorkplace } from "../../../api/employer";

interface AddWorkplaceModalProps {
	visible: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const AddWorkplaceModal: React.FC<AddWorkplaceModalProps> = ({
	visible,
	onClose,
	onSuccess,
}) => {
	const [workplaceName, setWorkplaceName] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [address, setAddress] = useState("");
	const [businessNumber, setBusinessNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const isValid = workplaceName.trim() !== "" && address.trim() !== "" && businessNumber.trim() !== "";

	const resetForm = () => {
		setWorkplaceName("");
		setZipCode("");
		setAddress("");
		setBusinessNumber("");
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async () => {
		if (!isValid) return;

		setIsLoading(true);
		try {
			const fullAddress = zipCode ? `(${zipCode}) ${address}` : address;
			const res = await createWorkplace({
				workplaceName: workplaceName.trim(),
				businessName: workplaceName.trim(),
				address: fullAddress.trim(),
				businessNumber: businessNumber.trim(),
			});

			if (res.success) {
				Alert.alert("등록 완료", "새로운 근무지가 등록되었습니다.");
				resetForm();
				onClose();
				onSuccess?.();
			} else {
				Alert.alert("등록 실패", res.error?.message || "근무지 등록에 실패했습니다.");
			}
		} catch (error: any) {
			Alert.alert("등록 실패", error?.message || "근무지 등록 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BottomSheetModal visible={visible} onClose={handleClose} maxHeight="85%">
			<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
				<Text weight="ExtraBold" style={styles.title}>
					새로운 근무지 추가하기
				</Text>

				{/* 근무지명 */}
				<View style={styles.fieldGroup}>
					<Text weight="Medium" style={styles.label}>근무지명</Text>
					<TextInput
						style={styles.input}
						value={workplaceName}
						onChangeText={setWorkplaceName}
						placeholder="근무지명을 입력하세요"
						placeholderTextColor={colors.textDisabled}
					/>
				</View>

				{/* 근무지 주소 */}
				<View style={styles.fieldGroup}>
					<Text weight="Medium" style={styles.label}>근무지 주소</Text>

					{/* 우편번호 */}
					<Text style={styles.subLabel}>우편번호</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={[styles.input, styles.inputFlex]}
							value={zipCode}
							onChangeText={setZipCode}
							placeholder="우편번호"
							placeholderTextColor={colors.textDisabled}
							keyboardType="number-pad"
						/>
						<TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
							<Text weight="SemiBold" style={styles.searchButtonText}>검색</Text>
						</TouchableOpacity>
					</View>

					{/* 주소지 */}
					<Text style={styles.subLabel}>주소지</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={[styles.input, styles.inputFlex]}
							value={address}
							onChangeText={setAddress}
							placeholder="주소를 입력하세요"
							placeholderTextColor={colors.textDisabled}
						/>
						<TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
							<Text weight="SemiBold" style={styles.searchButtonText}>검색</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* 사업자 등록 번호 */}
				<View style={styles.fieldGroup}>
					<Text weight="Medium" style={styles.label}>사업자 등록 번호</Text>
					<TextInput
						style={styles.input}
						value={businessNumber}
						onChangeText={setBusinessNumber}
						placeholder="000-00-00000"
						placeholderTextColor={colors.textDisabled}
						keyboardType="number-pad"
					/>
				</View>

				{/* 등록하기 버튼 */}
				<View style={styles.buttonArea}>
					{isLoading ? (
						<ActivityIndicator size="large" color={colors.primary} />
					) : (
						<PrimaryButton
							text="등록하기"
							onPress={handleSubmit}
							disabled={!isValid}
						/>
					)}
				</View>
			</ScrollView>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		color: colors.textPrimary,
		marginBottom: 28,
	},
	fieldGroup: {
		marginBottom: 24,
	},
	label: {
		fontSize: 15,
		color: colors.textPrimary,
		marginBottom: 8,
	},
	subLabel: {
		fontSize: 13,
		color: colors.textSecondary,
		marginBottom: 6,
		marginTop: 4,
	},
	input: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		height: 46,
		paddingHorizontal: 14,
		fontSize: 15,
		color: colors.textPrimary,
		backgroundColor: colors.white,
	},
	inputFlex: {
		flex: 1,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	searchButton: {
		height: 46,
		paddingHorizontal: 16,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	searchButtonText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	buttonArea: {
		alignItems: "flex-end",
		marginTop: 8,
		marginBottom: 16,
	},
});

export default AddWorkplaceModal;
