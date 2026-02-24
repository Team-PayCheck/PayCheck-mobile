import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	Step1UserTypeScreen,
	Step2ProfileScreen,
	Step3BasicInfoScreen,
	Step4AlarmScreen,
	Step5CompleteScreen,
} from "../screens/auth/signup";
import { useSignUpStore } from "../stores";

export type SignUpStackParamList = {
	Step1UserType: undefined;
	Step2Profile: undefined;
	Step3BasicInfo: undefined;
	Step4Alarm: undefined;
	Step5Complete: undefined;
	// RootNavigator의 화면들 (완료 후 이동용)
	EmployerHome: undefined;
	WorkerWeeklyCalendar: undefined;
	Welcome: undefined;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();

interface SignUpNavigatorProps {
	kakaoAccessToken: string;
}

const SignUpNavigator: React.FC<SignUpNavigatorProps> = ({ kakaoAccessToken }) => {
	const setKakaoAccessToken = useSignUpStore((state) => state.setKakaoAccessToken);
	const reset = useSignUpStore((state) => state.reset);

	useEffect(() => {
		// 회원가입 플로우 시작 시 store 초기화 후 토큰 저장
		reset();
		setKakaoAccessToken(kakaoAccessToken);
	}, [kakaoAccessToken, reset, setKakaoAccessToken]);

	return (
		<Stack.Navigator
			initialRouteName="Step1UserType"
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen name="Step1UserType" component={Step1UserTypeScreen} />
			<Stack.Screen name="Step2Profile" component={Step2ProfileScreen} />
			<Stack.Screen name="Step3BasicInfo" component={Step3BasicInfoScreen} />
			<Stack.Screen name="Step4Alarm" component={Step4AlarmScreen} />
			<Stack.Screen name="Step5Complete" component={Step5CompleteScreen} />
		</Stack.Navigator>
	);
};

export default SignUpNavigator;
