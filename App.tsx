import { StatusBar } from "expo-status-bar";
import ScheduleIntroScreen from "./src/screens/onboarding/ScheduleIntroScreen";

export default function App() {
  return (
    <>
      <ScheduleIntroScreen />
      <StatusBar style="dark" />
    </>
  );
}
