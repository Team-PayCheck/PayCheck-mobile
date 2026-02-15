import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text } from "../../../components/common/Text";
import { WorkerStackParamList } from "../../../navigation/WorkerStack";

type Props = NativeStackScreenProps<WorkerStackParamList, "ProfileEdit">;

const ProfileEditScreen: React.FC<Props> = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headerArea}>
				<TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
					<Text style={styles.backText}>{"< 홈"}</Text>
				</TouchableOpacity>
				<Text weight="Bold" style={styles.title}>내 프로필 수정</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F4F4F4",
		paddingHorizontal: 24,
	},
	headerArea: {
		paddingTop: 12,
		gap: 16,
	},
	backText: {
		fontSize: 18,
		color: "#222222",
	},
	title: {
		fontSize: 40,
		color: "#2F3135",
	},
});

export default ProfileEditScreen;
