import { Alert } from "react-native";
import { logout } from "../../api/auth";

/**
 * 로그아웃 핸들러
 * @param closeDrawer 드로어 닫기 함수
 * @param navigation React Navigation navigation 객체
 */
export const useLogoutHandler = (
  closeDrawer: () => void,
  navigation: any
) => {
  return () => {
    closeDrawer();
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              Alert.alert("로그아웃", "로그아웃이 완료되었습니다.");
            } catch (error: any) {
              Alert.alert(
                "로그아웃 실패",
                error?.message || "로그아웃 처리 중 오류가 발생했습니다."
              );
            } finally {
              navigation.getParent()?.reset({ index: 0, routes: [{ name: "Welcome" }] });
            }
          },
        },
      ]
    );
  };
};
