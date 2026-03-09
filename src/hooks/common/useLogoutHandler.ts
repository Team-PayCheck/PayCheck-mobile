import { Alert } from "react-native";
import { logout } from "../../api/auth";
import { unregisterPushToken } from "../../utils/pushToken";
import { showSuccess } from "../../utils/alert";

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
              await unregisterPushToken();
              await logout();
              showSuccess("로그아웃 완료", "로그아웃이 완료되었습니다.");
            } catch {
              // 로그아웃 API 실패는 무시 (finally에서 화면 이동 보장)
            } finally {
              navigation.getParent()?.reset({ index: 0, routes: [{ name: "Welcome" }] });
            }
          },
        },
      ]
    );
  };
};
