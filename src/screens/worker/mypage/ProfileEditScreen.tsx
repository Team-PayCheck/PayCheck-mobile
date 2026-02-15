import React, { useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeBackButton from "../../../components/common/HomeBackButton";
import { Text } from "../../../components/common/Text";
import Header from "../../../components/layout/Header";
import MyPageDrawer from "../../../components/worker/mypage/MyPageDrawer";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";

type Props = NativeStackScreenProps<WorkerStackParamList, "ProfileEdit">;

const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
	const [name, setName] = useState("김나현");
	const [phone, setPhone] = useState("010-5156-1565");
	const [email, setEmail] = useState("abc@naver.com");
	const [workerCode] = useState("dfae45");
	const [bank, setBank] = useState("하나은행");
	const [accountNumber, setAccountNumber] = useState("777-7777-7777-7777");
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

	const closeDrawer = () => setIsDrawerVisible(false);

	const navigateFromDrawer = (route: keyof WorkerStackParamList) => {
		closeDrawer();
		navigation.navigate(route);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
				<Header onPressLeft={() => setIsDrawerVisible(true)} />

				<View style={styles.headerArea}>
					<HomeBackButton onPress={() => navigation.navigate("WorkerHomeMain")} />
					<View style={styles.titleRow}>
						<Text weight="ExtraBold" style={styles.title}>내 프로필 수정</Text>
						<Image
							source={require("../../../assets/images/mypage/user.png")}
							style={styles.titleImage}
							resizeMode="contain"
						/>
					</View>
				</View>

				<View style={styles.formArea}>
					<View style={styles.nameRow}>
						<View style={styles.profilePhotoWrapper}>
							<View style={styles.profilePhoto}>
								<Image
									source={require("../../../assets/images/mypage/user.png")}
									style={styles.profileImage}
									resizeMode="contain"
								/>
							</View>
							<TouchableOpacity style={styles.settingButton} activeOpacity={0.8}>
								<Ionicons name="settings-outline" size={15} color="#8A8A8A" />
							</TouchableOpacity>
						</View>
						<TextInput
							value={name}
							onChangeText={setName}
							style={styles.input}
							placeholder="이름"
							placeholderTextColor="#A4A4A4"
						/>
						<TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.editButtonText}>수정</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.fieldRow}>
						<Text weight="Medium" style={styles.fieldLabel}>전화 번호</Text>
						<View style={styles.bankSelectorSpacer} />
						<TextInput
							value={phone}
							onChangeText={setPhone}
							style={styles.input}
							keyboardType="phone-pad"
							placeholder="전화 번호"
							placeholderTextColor="#A4A4A4"
						/>
						<TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.editButtonText}>수정</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.fieldRow}>
						<Text weight="Medium" style={styles.fieldLabel}>이메일</Text>
						<View style={styles.bankSelectorSpacer} />
						<TextInput
							value={email}
							onChangeText={setEmail}
							style={styles.input}
							keyboardType="email-address"
							placeholder="이메일"
							placeholderTextColor="#A4A4A4"
						/>
						<TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.editButtonText}>수정</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.fieldRow}>
						<Text
							weight="Medium"
							style={styles.fieldLabel}
							numberOfLines={1}
						>
							근무자코드
						</Text>
						<View style={styles.bankSelectorSpacer} />
						<TextInput
							value={workerCode}
							editable={false}
							style={[styles.input, styles.readOnlyInput]}
							placeholder="근무자코드"
							placeholderTextColor="#A4A4A4"
						/>
						<TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.editButtonText}>수정</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.fieldRow}>
						<Text weight="Medium" style={styles.fieldLabel}>은행</Text>
						<TouchableOpacity style={styles.bankSelector} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.bankText}>{bank}</Text>
							<Ionicons name="chevron-down" size={14} color="#888888" />
						</TouchableOpacity>
						<TextInput
							value={accountNumber}
							onChangeText={setAccountNumber}
							style={styles.input}
							placeholder="계좌번호"
							placeholderTextColor="#A4A4A4"
						/>
						<TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
							<Text weight="Medium" style={styles.editButtonText}>수정</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			<MyPageDrawer
				visible={isDrawerVisible}
				onClose={closeDrawer}
				onPressProfileEdit={() => closeDrawer()}
				onPressWorkplaceManage={() => navigateFromDrawer("WorkplaceManage")}
				onPressSentRequests={() => navigateFromDrawer("SentRequests")}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F4F4F4",
		paddingHorizontal: 24,
	},
	scrollContent: {
		paddingBottom: 34,
	},
	headerArea: {
		paddingTop: 8,
		gap: 12,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 24,
		color: "#353535",
		lineHeight: 52,
	},
	titleImage: {
		width: 100,
		height: 100,
		marginTop: -2,
	},
	formArea: {
		marginTop: 8,
		gap: 14,
	},
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 8,
	},
	profilePhotoWrapper: {
		position: "relative",
		width: 86,
		height: 86,
	},
	profilePhoto: {
		width: 86,
		height: 86,
		borderRadius: 43,
		backgroundColor: "#D9E5F2",
		alignItems: "center",
		justifyContent: "center",
	},
	profileImage: {
		width: 48,
		height: 48,
	},
	settingButton: {
		position: "absolute",
		right: -2,
		bottom: -1,
		width: 25,
		height: 25,
		borderRadius: 12.5,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#DCDCDC",
		alignItems: "center",
		justifyContent: "center",
	},
	fieldRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 7,
	},
	fieldLabel: {
		width: 68,
		fontSize: 15,
		color: "#8A8A8A",
	},
	readOnlyInput: {
		color: "#5E5E5E",
	},
	editButton: {
		width: 42,
		height: 33,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#DDDDDD",
		backgroundColor: "#F8F8F8",
		alignItems: "center",
		justifyContent: "center",
	},
	editButtonText: {
		fontSize: 13,
		color: "#4D4D4D",
	},
	bankSelector: {
		width: 82,
		height: 40,
		borderRadius: 10,
		backgroundColor: "#F3F3F3",
		borderWidth: 1,
		borderColor: "#E6E6E6",
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	bankSelectorSpacer: {
		width: 82,
		height: 40,
	},
	bankText: {
		fontSize: 13,
		color: "#4B4B4B",
	},
	input: {
		flex: 1,
		height: 40,
		backgroundColor: "#F3F3F3",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#E6E6E6",
		paddingHorizontal: 12,
		fontSize: 15,
		color: "#4B4B4B",
		fontFamily: "Pretendard-Medium",
	},
});

export default ProfileEditScreen;
