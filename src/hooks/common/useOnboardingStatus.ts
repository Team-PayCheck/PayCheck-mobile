import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useOnboardingStatus = () => {
	const [initialRoute, setInitialRoute] = useState<"Onboarding" | "Welcome">("Onboarding");
	const [isLoading, setIsLoading] = useState(true);

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

	const handleOnboardingComplete = async (navigation: any) => {
		try {
			await AsyncStorage.setItem("@onboarding_completed", "true");
			navigation.navigate("Welcome");
		} catch (error) {
			console.error("Failed to save onboarding status:", error);
		}
	};

	return { initialRoute, isLoading, handleOnboardingComplete };
};
