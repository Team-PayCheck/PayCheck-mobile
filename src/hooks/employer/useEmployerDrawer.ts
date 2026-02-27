import { useState, useCallback } from "react";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";
import { useLogoutHandler } from "../common/useLogoutHandler";

/** Drawer 메뉴와 1:1 대응하는 화면 이름 */
type DrawerScreen =
	| "EmployerProfileEdit"
	| "EmployerWorkplaceManage"
	| "EmployerReceivedRequests"
	| "EmployerWithdraw";

/** navigation에서 실제로 사용하는 메서드만 추출한 최소 인터페이스 */
interface DrawerNavigation {
	navigate: (route: keyof EmployerStackParamList) => void;
	getParent: () => { reset: (state: { index: number; routes: { name: string }[] }) => void } | undefined;
}

/**
 * 고용주 마이페이지 Drawer + 계정이용 BottomSheet 보일러플레이트를 한 곳에서 관리하는 훅.
 *
 * @param navigation - EmployerStack navigation 객체
 * @param currentScreen - 현재 화면 이름. 해당 메뉴 항목은 navigate 대신 closeDrawer만 실행.
 */
export function useEmployerDrawer(
	navigation: DrawerNavigation,
	currentScreen?: DrawerScreen,
) {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isAccountSheetVisible, setIsAccountSheetVisible] = useState(false);

	const openDrawer = useCallback(() => setIsDrawerVisible(true), []);
	const closeDrawer = useCallback(() => setIsDrawerVisible(false), []);

	const navigateFromDrawer = useCallback(
		(route: keyof EmployerStackParamList) => {
			setIsDrawerVisible(false);
			navigation.navigate(route);
		},
		[navigation],
	);

	const handleLogout = useLogoutHandler(closeDrawer, navigation);

	const makeHandler = useCallback(
		(screen: DrawerScreen) =>
			currentScreen === screen
				? closeDrawer
				: () => navigateFromDrawer(screen),
		[currentScreen, closeDrawer, navigateFromDrawer],
	);

	const drawerProps = {
		visible: isDrawerVisible,
		onClose: closeDrawer,
		onPressProfileEdit: makeHandler("EmployerProfileEdit"),
		onPressWorkplaceManage: makeHandler("EmployerWorkplaceManage"),
		onPressReceivedRequests: makeHandler("EmployerReceivedRequests"),
		onPressAccountSettings: () => {
			setIsDrawerVisible(false);
			setTimeout(() => setIsAccountSheetVisible(true), 220);
		},
		onPressLogout: handleLogout,
		onPressWithdraw: makeHandler("EmployerWithdraw"),
	};

	const accountSheetProps = {
		visible: isAccountSheetVisible,
		onClose: () => setIsAccountSheetVisible(false),
	};

	return {
		openDrawer,
		drawerProps,
		accountSheetProps,
	};
}
