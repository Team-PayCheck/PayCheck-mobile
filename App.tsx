import { StatusBar } from "expo-status-bar";
import NoticeIntroScreen from "./src/screens/onboarding/NoticeIntroScreen";

export default function App() {
  return (
    <>
      <NoticeIntroScreen />
      <StatusBar style="dark" />
    </>
  );
}
