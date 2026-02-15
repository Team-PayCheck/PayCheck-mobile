import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	Step1UserTypeScreen,
	Step2ProfileScreen,
	Step3BasicInfoScreen,
	Step4AlarmScreen,
	Step5CompleteScreen,
} from "../screens/auth/signup";
import type { UserType } from "../types/signup.types";

export type SignUpStackParamList = {
	Step1UserType: {
		kakaoAccessToken: string;
	};
	Step2Profile: {
		userType: UserType;
	};
	Step3BasicInfo: {
		userType: UserType;
		profileImageUri: string | null;
	};
	Step4Alarm: {
		userType: UserType;
		profileImageUri: string | null;
		name: string;
		phone: string;
		bankName: string;
		accountNumber: string;
	};
	Step5Complete: {
		userType: UserType;
		profileImageUri: string | null;
		name: string;
		phone: string;
		bankName: string;
		accountNumber: string;
		isAlarmEnabled: boolean;
	};
	// RootNavigator의 화면들 (완료 후 이동용)
	EmployerHome: undefined;
	WorkerHome: undefined;
};

const Stack = createNativeStackNavigator<SignUpStackParamList>();

interface SignUpNavigatorProps {
	kakaoAccessToken: string;
}

const SignUpNavigator: React.FC<SignUpNavigatorProps> = ({ kakaoAccessToken }) => {
	return (
		<Stack.Navigator
			initialRouteName="Step1UserType"
			screenOptions={{
				headerShown: false,
				animation: "slide_from_right",
			}}
		>
			<Stack.Screen
				name="Step1UserType"
				component={Step1UserTypeScreen}
				initialParams={{ kakaoAccessToken }}
			/>
			<Stack.Screen name="Step2Profile" component={Step2ProfileScreen} />
			<Stack.Screen name="Step3BasicInfo" component={Step3BasicInfoScreen} />
			<Stack.Screen name="Step4Alarm" component={Step4AlarmScreen} />
			<Stack.Screen name="Step5Complete" component={Step5CompleteScreen} />
		</Stack.Navigator>
	);
};

export default SignUpNavigator;
