import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useOnboardingStatus } from "../hooks/common/useOnboardingStatus";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import SignUpNavigator from "./SignUpNavigator";
import EmployerHomeScreen from "../screens/employer/EmployerHomeScreen";
import WorkerHomeScreen from "../screens/worker/WorkerHomeScreen";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
	SignUp: { kakaoAccessToken: string };
	EmployerHome: undefined;
	WorkerHome: undefined;
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
								const targetRoute = userType === 'EMPLOYER' ? 'EmployerHome' : 'WorkerHome';
								props.navigation.replace(targetRoute);
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
				<Stack.Screen name="WorkerHome" component={WorkerHomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
