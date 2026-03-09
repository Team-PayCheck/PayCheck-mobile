import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useOnboardingStatus } from "../hooks/common/useOnboardingStatus";
import { useNotificationStream } from "../hooks/common/useNotificationStream";
import { useFcmToken } from "../hooks/common/useFcmToken";
import { useNotificationNavigation } from "../hooks/common/useNotificationNavigation";
import { setLogoutCallback } from "../api/axios";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";
import SignUpNavigator from "./SignUpNavigator";
import EmployerStack from "../navigation/EmployerStack";
import WorkerStack from "../navigation/WorkerStack";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
	SignUp: { kakaoAccessToken: string };
	EmployerHome: undefined;
	WorkerWeeklyCalendar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
	const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
	const [isNavReady, setIsNavReady] = useState(false);
	const { initialRoute, isLoading, handleOnboardingComplete } = useOnboardingStatus();
	useNotificationStream();
	useFcmToken();
	useNotificationNavigation(isNavReady ? navigationRef.current : null);

	useEffect(() => {
		if (!isNavReady) return;
		setLogoutCallback(() => {
			navigationRef.current?.reset({ index: 0, routes: [{ name: "Welcome" }] });
		});
	}, [isNavReady]);

	if (isLoading) {
		return null;
	}

	return (
		<NavigationContainer ref={navigationRef} onReady={() => setIsNavReady(true)}>
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
				<Stack.Screen name="EmployerHome" component={EmployerStack} />
				<Stack.Screen name="WorkerWeeklyCalendar" component={WorkerStack} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
