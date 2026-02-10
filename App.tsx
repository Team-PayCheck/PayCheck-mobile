import { StatusBar } from "expo-status-bar";
import OnboardingStack from "./src/navigation/OnboardingStack";

export default function App() {
  return (
    <>
      <OnboardingStack onComplete={() => console.log("Onboarding completed")} />
      <StatusBar style="dark" />
    </>
  );
}
