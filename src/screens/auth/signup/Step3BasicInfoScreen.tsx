import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	ProgressBar,
	StepHeader,
	FormInput,
	PhoneInput,
	BankSelectModal,
} from "../../../components/signup";
import PrimaryButton from "../../../components/common/PrimaryButton";
import { colors } from "../../../constants/colors";
import { useSignUpStore } from "../../../stores";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";
import type { BankName } from "../../../constants/bank";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step3BasicInfo">;

const Step3BasicInfoScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();

	// Store에서 값 가져오기
	const userType = useSignUpStore((state) => state.userType);
	const name = useSignUpStore((state) => state.name);
	const phone = useSignUpStore((state) => state.phone);
	const bankName = useSignUpStore((state) => state.bankName);
	const accountNumber = useSignUpStore((state) => state.accountNumber);

	// Store 액션
	const setName = useSignUpStore((state) => state.setName);
	const setPhone = useSignUpStore((state) => state.setPhone);
	const setBankName = useSignUpStore((state) => state.setBankName);
	const setAccountNumber = useSignUpStore((state) => state.setAccountNumber);

	const [isBankModalVisible, setIsBankModalVisible] = useState(false);

	const isWorker = userType === "WORKER";

	const handleBankSelect = (selected: BankName) => {
		setBankName(selected);
	};

	// 이름 입력 시 한글/영문만 허용
	const handleNameChange = (text: string) => {
		const filtered = text.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "");
		setName(filtered);
	};

	const handleNext = () => {
		navigation.navigate("Step4Alarm");
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoid}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* 헤더 */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => navigation.goBack()}
					>
						<Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
					</TouchableOpacity>
					<View style={styles.progressBarContainer}>
						<ProgressBar currentStep={3} totalSteps={5} />
					</View>
				</View>

				{/* 콘텐츠 */}
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<StepHeader step={3} totalSteps={5} title="기본정보" />

					<View style={styles.formContainer}>
						<FormInput
							label="이름"
							value={name}
							onChangeText={handleNameChange}
							placeholder="이름을 입력하세요"
						/>

						<PhoneInput value={phone} onChangeText={setPhone} />

						{/* 근로자만 은행/계좌 입력 */}
						{isWorker && (
							<>
								<FormInput
									label="은행명"
									value={bankName}
									placeholder="은행을 선택하세요"
									onPress={() => setIsBankModalVisible(true)}
									showChevron
								/>

								<FormInput
									label="계좌번호"
									value={accountNumber}
									onChangeText={setAccountNumber}
									placeholder="계좌번호를 입력하세요"
									keyboardType="number-pad"
								/>
							</>
						)}
					</View>
				</ScrollView>

				{/* 하단 버튼 */}
				<View style={styles.footer}>
					<PrimaryButton text="다음" onPress={handleNext} />
				</View>
			</KeyboardAvoidingView>

			{/* 은행 선택 모달 */}
			<BankSelectModal
				visible={isBankModalVisible}
				onClose={() => setIsBankModalVisible(false)}
				onSelect={handleBankSelect}
				selectedBank={bankName}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	keyboardAvoid: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButton: {
		padding: 4,
	},
	progressBarContainer: {
		flex: 1,
		marginLeft: 8,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingTop: 40,
		paddingBottom: 20,
		gap: 40,
	},
	formContainer: {
		gap: 24,
	},
	footer: {
		paddingHorizontal: 40,
		paddingBottom: 20,
		alignItems: "center",
	},
});

export default Step3BasicInfoScreen;
