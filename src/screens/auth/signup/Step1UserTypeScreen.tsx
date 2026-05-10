import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SignUpScreenLayout, UserTypeCard } from "../../../components/signup";
import { useSignUpStore } from "../../../stores";
import type { UserType } from "../../../api/user/types";
import type { SignUpStackParamList } from "../../../navigation/SignUpNavigator";

type NavigationProp = NativeStackNavigationProp<SignUpStackParamList, "Step1UserType">;

const Step1UserTypeScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const userType = useSignUpStore((state) => state.userType);
	const setUserType = useSignUpStore((state) => state.setUserType);

	const handleSelect = (type: UserType) => {
		setUserType(type);
		// 선택 후 잠시 대기 후 다음 화면으로 이동
		setTimeout(() => {
			navigation.navigate("Step3BasicInfo");
		}, 300);
	};

	return (
		<SignUpScreenLayout
			currentStep={1}
			stepTitle="회원유형"
			contentStyle={styles.content}
		>
			<View style={styles.cardContainer}>
				<UserTypeCard
					type="WORKER"
					selected={userType === "WORKER"}
					onPress={() => handleSelect("WORKER")}
				/>
				<UserTypeCard
					type="EMPLOYER"
					selected={userType === "EMPLOYER"}
					onPress={() => handleSelect("EMPLOYER")}
				/>
			</View>
		</SignUpScreenLayout>
	);
};

const styles = StyleSheet.create({
	content: {
		gap: 60,
	},
	cardContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
	},
});

export default Step1UserTypeScreen;
