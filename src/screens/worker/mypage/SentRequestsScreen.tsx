import React, { useState } from "react";
import { Alert, StyleSheet, View, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/mypage/drawer/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";

type Props = NativeStackScreenProps<WorkerStackParamList, "SentRequests">;


import { dummyRequests } from "../../../dummyData/workerMyPage";

const SentRequestsScreen: React.FC<Props> = ({ navigation }) => {
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onPressLeft={() => setIsDrawerVisible(true)} />
			<View style={styles.headerRow}>
				<View style={{ flex: 1 }}>
					<HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
					<Text weight="ExtraBold" style={styles.title}>보낸 근무요청 보기</Text>
				</View>
				<View style={styles.illustWrapper}>
					<Image
						source={require("../../../assets/images/mypage/chat.png")}
						style={styles.illust}
						resizeMode="contain"
					/>
				</View>
			</View>

			<View style={styles.cardList}>
				{dummyRequests.map((r, idx) => {
					const expanded = openIdx === idx;
					return (
						<View key={r.workplace + r.date + r.time + idx} style={{ marginBottom: 24 }}>
							<View style={[styles.card, expanded && styles.cardExpanded]}>
								<View style={styles.cardHeaderRow}>
									<View style={styles.cardLeft}>
										<Image
											source={r.image}
											style={styles.profileImg}
											resizeMode="cover"
										/>
										<View style={styles.infoCol}>
											<Text weight="Medium" style={styles.profileName}>{r.workplace}</Text>
											<Text weight="Bold" style={styles.timeText}>{`${r.date} ${r.time}`}</Text>
										</View>
									</View>
									<View style={styles.cardRight}>
										<View style={[styles.statusPill, r.status === "대기" ? styles.statusPending : styles.statusApproved]}>
											<Text weight="Medium" style={r.status === "대기" ? styles.statusPendingText : styles.statusApprovedText}>{r.status}</Text>
										</View>
										<Feather
											name={expanded ? "chevron-up" : "chevron-down"}
											size={22}
											color="#353535"
											style={{ marginLeft: 6 }}
											onPress={() => setOpenIdx(expanded ? null : idx)}
										/>
									</View>
								</View>
								{expanded && (
									<View style={styles.detailBox}>
										<View style={{ gap: 14 }}>
											<Text style={{ color: "#848484", fontSize: 15, marginBottom: 2 }}>근무지</Text>
											<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ededed" }}>
												<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.workplaceName}</Text>
											</View>
											<Text style={{ color: "#848484", fontSize: 15, marginBottom: 2 }}>근무 시간</Text>
											<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
												<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#ededed", minWidth: 56, alignItems: "center" }}>
													<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.workDate}</Text>
												</View>
												<View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#ededed", minWidth: 36, alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.startHour}</Text>
													</View>
													<Text>:</Text>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#ededed", minWidth: 36, alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.startMin}</Text>
													</View>
													<Text style={{ marginHorizontal: 4 }}>~</Text>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#ededed", minWidth: 36, alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.endHour}</Text>
													</View>
													<Text>:</Text>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 8, borderWidth: 1, borderColor: "#ededed", minWidth: 36, alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.endMin}</Text>
													</View>
												</View>
											</View>
											<View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
												<View style={{ flex: 1 }}>
													<Text style={{ color: "#848484", fontSize: 15, marginBottom: 2 }}>휴게 시간</Text>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ededed", flexDirection: "row", alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.breakMin}</Text>
														<Text style={{ color: "#848484", fontSize: 15, marginLeft: 2 }}>분</Text>
													</View>
												</View>
												<View style={{ flex: 1 }}>
													<Text style={{ color: "#848484", fontSize: 15, marginBottom: 2 }}>시급</Text>
													<View style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#ededed", flexDirection: "row", alignItems: "center" }}>
														<Text style={{ color: "#353535", fontSize: 16 }}>{r.detail.wage}</Text>
														<Text style={{ color: "#848484", fontSize: 15, marginLeft: 2 }}>원</Text>
													</View>
												</View>
											</View>
											<View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 18, marginTop: 10 }}>
												<Text style={{ color: "#b0b0b0", fontSize: 15 }}>수정</Text>
												<Text style={{ color: "#ff4d4f", fontSize: 15 }}>삭제</Text>
											</View>
										</View>
									</View>
								)}
							</View>
						</View>
					);
				})}
			</View>

			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => navigateFromDrawer("ProfileEdit")}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => closeDrawer()}
				onPressAccountSettings={() => navigateFromDrawer("AccountSettings")}
				onPressLogout={() => {
					closeDrawer();
					Alert.alert("로그아웃", "로그아웃 기능은 다음 단계에서 연결됩니다.");
				}}
				onPressWithdraw={() => navigateFromDrawer("Withdraw")}
			/>
		</SafeAreaView>
	);
};

function statusColor(status: string) {
	if (status === "승인") return "statusApproved";
	if (status === "거절") return "statusRejected";
	return "statusPending";
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		paddingHorizontal: 24,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingTop: 10,
		marginBottom: 12,
	},
	illustWrapper: {
		width: 100,
		height: 100,
		marginTop: -8,
		marginRight: -8,
	},
	illust: {
		width: "100%",
		height: "100%",
	},
	title: {
		marginTop: 4,
		fontSize: 24,
		color: "#353535",
		lineHeight: 52,
	},
	cardList: {
		marginTop: 8,
	},
	card: {
		backgroundColor: "#FFF",
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		shadowColor: "#000",
		shadowOpacity: 0.07,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 8,
		elevation: 3,
		marginBottom: 0,
	},
	cardExpanded: {
		paddingBottom: 0,
	},
	cardHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	detailBox: {
		marginTop: 18,
		marginBottom: 32,
	},
	cardLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	profileImg: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: "#E0E0E0",
	},
	infoCol: {
		justifyContent: "center",
	},
	profileName: {
		fontSize: 15,
		color: "#848484",
		marginBottom: 2,
	},
	timeText: {
		fontSize: 18,
		color: "#000",
	},
	cardRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 0,
	},
	statusPill: {
		minWidth: 60,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 14,
		marginRight: 2,
	},
	statusPending: {
		backgroundColor: "#2563eb",
	},
	statusApproved: {
		backgroundColor: "#ededed",
	},
	statusPendingText: {
		color: "#fff",
		fontSize: 15,
	},
	statusApprovedText: {
		color: "#b0b0b0",
		fontSize: 15,
	},
});

export default SentRequestsScreen;
