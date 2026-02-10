import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingStack from "./OnboardingStack";
import WelcomeScreen from "../screens/onboarding/WelcomeScreen";

export type RootStackParamList = {
	Onboarding: undefined;
	Welcome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
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
							onComplete={() => props.navigation.navigate("Welcome")}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Welcome" component={WelcomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default RootNavigator;
