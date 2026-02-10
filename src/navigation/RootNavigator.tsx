import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useOnboardingStatus } from "../hooks/common/useOnboardingStatus";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
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
							onKakaoLogin={() => {
								console.log("Kakao Login Success! User authenticated.");
								console.log("Redirecting to home screen (TODO: Create home screen)");
							}}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
