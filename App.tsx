import { StatusBar } from "expo-status-bar";
import PayrollIntroScreen from "./src/screens/onboarding/PayrollIntroScreen";

export default function App() {
  return (
    <>
      <PayrollIntroScreen />
      <StatusBar style="dark" />
    </>
  );
}
