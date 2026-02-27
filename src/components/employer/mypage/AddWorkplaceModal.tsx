import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
	ActivityIndicator,
	Switch,
} from "react-native";
import BottomSheetModal from "../../common/BottomSheetModal";
import PrimaryButton from "../../common/PrimaryButton";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { createWorkplace } from "../../../api/employer";
import { searchAddress, type KakaoAddress } from "../../../api/kakao";

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
	const [searchQuery, setSearchQuery] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [address, setAddress] = useState("");
	const [businessNumber, setBusinessNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState<KakaoAddress[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [isSmallBusiness, setIsSmallBusiness] = useState(false);

	const formatBusinessNumber = (text: string) => {
		const digits = text.replace(/\D/g, "").slice(0, 10);
		if (digits.length <= 3) return digits;
		if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
		return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
	};

	const BUSINESS_NUMBER_REGEX = /^\d{3}-\d{2}-\d{5}$/;
	const isValidBusinessNumber = BUSINESS_NUMBER_REGEX.test(businessNumber);
	const isValid = workplaceName.trim() !== "" && address.trim() !== "" && isValidBusinessNumber;

	const resetForm = () => {
		setWorkplaceName("");
		setSearchQuery("");
		setZipCode("");
		setAddress("");
		setBusinessNumber("");
		setSearchResults([]);
		setShowResults(false);
		setIsSmallBusiness(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSearch = async () => {
		const query = searchQuery.trim();
		if (!query) {
			Alert.alert("검색어 입력", "주소를 입력해주세요.");
			return;
		}

		setIsSearching(true);
		try {
			const results = await searchAddress(query);
			if (results.length === 0) {
				Alert.alert("검색 결과 없음", "검색 결과가 없습니다. 다른 주소를 입력해주세요.");
				setShowResults(false);
			} else {
				setSearchResults(results);
				setShowResults(true);
			}
		} catch {
			Alert.alert("검색 실패", "주소 검색 중 오류가 발생했습니다.");
		} finally {
			setIsSearching(false);
		}
	};

	const handleSelectAddress = (item: KakaoAddress) => {
		setZipCode(item.zoneNo);
		setAddress(item.addressName);
		setShowResults(false);
		setSearchQuery("");
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
				isLessThanFiveEmployees: isSmallBusiness,
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

					{/* 주소 검색 */}
					<Text style={styles.subLabel}>주소 검색</Text>
					<View style={styles.inputRow}>
						<TextInput
							style={[styles.input, styles.inputFlex]}
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder="도로명 또는 지번 주소 입력"
							placeholderTextColor={colors.textDisabled}
							returnKeyType="search"
							onSubmitEditing={handleSearch}
						/>
						<TouchableOpacity
							style={styles.searchButton}
							activeOpacity={0.7}
							onPress={handleSearch}
							disabled={isSearching}
						>
							{isSearching ? (
								<ActivityIndicator size="small" color={colors.textPrimary} />
							) : (
								<Text weight="SemiBold" style={styles.searchButtonText}>검색</Text>
							)}
						</TouchableOpacity>
					</View>

					{/* 검색 결과 목록 */}
					{showResults && searchResults.length > 0 && (
						<View style={styles.resultList}>
							{searchResults.map((item, index) => (
								<TouchableOpacity
									key={`${item.zoneNo}-${index}`}
									style={[
										styles.resultItem,
										index < searchResults.length - 1 && styles.resultItemBorder,
									]}
									activeOpacity={0.7}
									onPress={() => handleSelectAddress(item)}
								>
									<Text style={styles.resultZoneNo}>{item.zoneNo}</Text>
									<Text style={styles.resultAddress}>{item.addressName}</Text>
								</TouchableOpacity>
							))}
						</View>
					)}

					{/* 우편번호 (읽기 전용) */}
					<Text style={styles.subLabel}>우편번호</Text>
					<TextInput
						style={[styles.input, styles.readonlyInput]}
						value={zipCode}
						placeholder="검색으로 자동 입력"
						placeholderTextColor={colors.textDisabled}
						editable={false}
					/>

					{/* 주소지 (읽기 전용) */}
					<Text style={styles.subLabel}>주소지</Text>
					<TextInput
						style={[styles.input, styles.readonlyInput]}
						value={address}
						placeholder="검색으로 자동 입력"
						placeholderTextColor={colors.textDisabled}
						editable={false}
					/>
				</View>

				{/* 사업자 등록 번호 */}
				<View style={styles.fieldGroup}>
					<Text weight="Medium" style={styles.label}>사업자 등록 번호</Text>
					<TextInput
						style={styles.input}
						value={businessNumber}
						onChangeText={(text) => setBusinessNumber(formatBusinessNumber(text))}
						placeholder="000-00-00000"
						placeholderTextColor={colors.textDisabled}
						keyboardType="number-pad"
						maxLength={12}
					/>
				</View>

				{/* 5인 미만 사업장 여부 */}
				<View style={styles.switchGroup}>
					<Text weight="Medium" style={styles.label}>5인 미만 사업장</Text>
					<Switch
						value={isSmallBusiness}
						onValueChange={setIsSmallBusiness}
						trackColor={{ false: colors.border, true: colors.primary }}
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
	readonlyInput: {
		backgroundColor: colors.backgroundGrey,
		color: colors.textSecondary,
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
		minWidth: 56,
	},
	searchButtonText: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	resultList: {
		marginTop: 8,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 10,
		backgroundColor: colors.white,
		maxHeight: 200,
	},
	resultItem: {
		paddingVertical: 12,
		paddingHorizontal: 14,
	},
	resultItemBorder: {
		borderBottomWidth: 1,
		borderBottomColor: colors.borderLight,
	},
	resultZoneNo: {
		fontSize: 12,
		color: colors.textSecondary,
		marginBottom: 2,
	},
	resultAddress: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	switchGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	buttonArea: {
		alignItems: "flex-end",
		marginTop: 8,
		marginBottom: 16,
	},
});

export default AddWorkplaceModal;
