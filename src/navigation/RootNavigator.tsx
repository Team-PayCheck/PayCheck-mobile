import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useOnboardingStatus } from "../hooks/common/useOnboardingStatus";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import SignUpNavigator from "./SignUpNavigator";
import EmployerHomeScreen from "../screens/employer/EmployerHomeScreen";
import WorkerStack from "../navigation/WorkerStack";
import WorkerWeeklyCalendarScreen from "../screens/worker/WorkerWeeklyCalendarScreen";
import WorkplaceManageScreen from "../screens/employer/WorkplaceManageScreen";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
	SignUp: { kakaoAccessToken: string };
	EmployerHome: undefined;
	WorkerWeeklyCalendar: undefined;
	WorkplaceManage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
	const { initialRoute, isLoading, handleOnboardingComplete } = useOnboardingStatus();

	if (isLoading) {
		return null;
	}

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={initialRoute}
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name="Onboarding">
					{(props) => (
						<OnboardingStack
							onComplete={() => handleOnboardingComplete(props.navigation)}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Welcome">
					{(props) => (
						<WelcomeScreen
							onLoginSuccess={(userType) => {
								// userType에 따라 다른 화면으로 이동
								const targetRoute = userType === 'EMPLOYER' ? 'EmployerHome' : 'WorkerWeeklyCalendar';
								props.navigation.replace(targetRoute); // 추후 userType에 따라 targetRoute로 변경!!!! 잊지말기
							}}
							onSignUpNeeded={(kakaoAccessToken) => {
								// 회원가입 화면으로 이동하면서 카카오 액세스 토큰 전달
								props.navigation.navigate("SignUp", { kakaoAccessToken });
							}}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="SignUp">
					{(props) => (
						<SignUpNavigator
							kakaoAccessToken={props.route.params?.kakaoAccessToken || ""}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="EmployerHome" component={EmployerHomeScreen} />
				<Stack.Screen name="WorkerWeeklyCalendar" component={WorkerStack} />
				<Stack.Screen name="WorkplaceManage" component={WorkplaceManageScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
