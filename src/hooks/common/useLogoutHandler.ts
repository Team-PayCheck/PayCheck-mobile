import { Alert } from "react-native";

export const useLogoutHandler = (closeDrawer: () => void) => {
  return () => {
    closeDrawer();
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?");
  };
};
