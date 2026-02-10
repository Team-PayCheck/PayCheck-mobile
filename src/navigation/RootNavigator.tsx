import React, { useEffect, useState } from "react";
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
	const [initialRoute, setInitialRoute] = useState<"Onboarding" | "Welcome">("Onboarding");
	const [isLoading, setIsLoading] = useState(true);

	// 앱 시작 시 AsyncStorage에서 온보딩 완료 여부 확인
	useEffect(() => {
		const checkOnboardingStatus = async () => {
			try {
				const onboardingCompleted = await AsyncStorage.getItem(
					"@onboarding_completed"
				);
				if (onboardingCompleted === "true") {
					setInitialRoute("Welcome");
				}
			} catch (error) {
				console.error("Failed to check onboarding status:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkOnboardingStatus();
	}, []);

	// 초기 로딩 중일 때
	if (isLoading) {
		return null;
	}

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
