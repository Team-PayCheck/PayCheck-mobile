import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    // 온보딩 완료 상태를 AsyncStorage에 저장하고 Welcome 화면으로 이동
    const handleOnboardingComplete = async (navigation: any) => {
		try {
			await AsyncStorage.setItem("@onboarding_completed", "true");
			navigation.navigate("Welcome");
		} catch (error) {
			console.error("Failed to save onboarding status:", error);
		}
	};

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Onboarding"
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
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
