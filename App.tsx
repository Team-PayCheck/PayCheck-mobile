import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import RootNavigator from "./src/navigation/RootNavigator";

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
			<RootNavigator />
			<StatusBar style="dark" />
		</>
	);
}
