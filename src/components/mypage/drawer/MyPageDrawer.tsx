import React, { useEffect, useRef } from "react";
import {
	Animated,
	Modal,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileCard from "./ProfileCard";
import { useWorkerData } from "../../../hooks/worker/useUserData";
import MenuButton from "./MenuButton";
import SmallActionButton from "./SmallActionButton";
import { colors } from "../../../constants/colors";

interface MyPageDrawerProps {
	visible: boolean;
	onClose: () => void;
	onPressProfileEdit?: () => void;
	onPressWorkplaceManage?: () => void;
	onPressSentRequests?: () => void;
	onPressNotificationSettings?: () => void;
	onPressAccountSettings?: () => void;
	onPressLogout?: () => void;
	onPressWithdraw?: () => void;
}

const DRAWER_WIDTH = 288;

const MyPageDrawer: React.FC<MyPageDrawerProps> = ({
	visible,
	onClose,
	onPressProfileEdit,
	onPressWorkplaceManage,
	onPressSentRequests,
	onPressNotificationSettings,
	onPressAccountSettings,
	onPressLogout,
	onPressWithdraw,
}) => {
	const { user, worker, isLoading } = useWorkerData();
	const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

	useEffect(() => {
		Animated.timing(translateX, {
			toValue: visible ? 0 : -DRAWER_WIDTH,
			duration: 220,
			useNativeDriver: true,
		}).start();
	}, [translateX, visible]);

	return (
		<Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<Pressable style={styles.backdrop} onPress={onClose} />
				<Animated.View style={[styles.drawerContainer, { transform: [{ translateX }] }]}> 
					<View style={styles.drawerTop}>
						<TouchableOpacity onPress={onClose} activeOpacity={0.8}>
							<Ionicons name="close" size={30} color={colors.textPrimary} />
						</TouchableOpacity>
					</View>

					{/* 프로필 정보 연동 */}
						{isLoading ? (
							<ProfileCard name="로딩중" code="..." />
						) : worker ? (
							<ProfileCard
								name={worker.name}
								code={worker.workerCode ? `@${worker.workerCode}` : "-"}
									/>
						) : (
							<ProfileCard name="정보 없음" code="-" />
						)}

					<View style={styles.menuGroup}>
						<MenuButton
							title="내 프로필 수정"
							iconSource={require("../../../assets/images/mypage/user.png")}
							onPress={onPressProfileEdit}
						/>
						<MenuButton
							title="근무지 관리"
							iconSource={require("../../../assets/images/mypage/location.png")}
							onPress={onPressWorkplaceManage}
						/>
						<MenuButton
							title="보낸 근무요청"
							iconSource={require("../../../assets/images/mypage/chat.png")}
							onPress={onPressSentRequests}
						/>
						<MenuButton
							title="알림 설정"
							iconSource={require("../../../assets/images/mypage/bell.png")}
							iconImageSize={115}
							onPress={onPressNotificationSettings}
						/>
						<MenuButton
							title="계정 이용 / 이용동의"
							iconSource={require("../../../assets/images/mypage/info.png")}
							onPress={() => {
								// 페이지 이동 대신 부모 스크린에 신호 전달
								if (onPressAccountSettings) onPressAccountSettings();
							}}
						/>
					</View>

					<View style={styles.bottomButtons}>
						<SmallActionButton text="로그아웃" onPress={onPressLogout} />
						<SmallActionButton text="회원탈퇴" onPress={onPressWithdraw} />
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.35)",
		flexDirection: "row",
	},
	backdrop: {
		flex: 1,
	},
	drawerContainer: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: DRAWER_WIDTH,
		backgroundColor: colors.background,
		borderTopRightRadius: 42,
		borderBottomRightRadius: 42,
		paddingTop: 54,
		paddingHorizontal: 20,
	},
	drawerTop: {
		alignItems: "flex-start",
		marginBottom: 30,
	},
	menuGroup: {
		marginTop: 50,
		gap: 16,
	},
	bottomButtons: {
		marginTop: "auto",
		marginBottom: 34,
		flexDirection: "row",
		justifyContent: "center",
		gap: 15,
	},
});

export default MyPageDrawer;
