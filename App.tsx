import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import OnboardingStack from "./src/navigation/OnboardingStack";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
	const [fontsLoaded, fontError] = useFonts({
		"Pretendard-Regular": require("./src/assets/fonts/Pretendard-Regular.otf"),
		"Pretendard-Medium": require("./src/assets/fonts/Pretendard-Medium.otf"),
		"Pretendard-SemiBold": require("./src/assets/fonts/Pretendard-SemiBold.otf"),
		"Pretendard-Bold": require("./src/assets/fonts/Pretendard-Bold.otf"),
		"Pretendard-ExtraBold": require("./src/assets/fonts/Pretendard-ExtraBold.otf"),
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return null;
	}

	return (
		<>
			<OnboardingStack onComplete={() => console.log("Onboarding completed")} />
			<StatusBar style="dark" />
		</>
	);
}
