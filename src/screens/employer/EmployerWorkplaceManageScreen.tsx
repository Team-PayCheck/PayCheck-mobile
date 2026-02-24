import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../../components/common/Text";
import { colors } from "../../constants/colors";
import EmployerNavigationBar, {
	type EmployerTabName,
} from "../../components/layout/EmployerNavigationBar";
import EmployerWorkplaceCard from "../../components/employer/EmployerWorkplaceCard";
import { getWorkplaces } from "../../api/employer";
import type { WorkplaceListItem } from "../../api/employer/types";
import type { EmployerStackParamList } from "../../navigation/EmployerStack";

const TAB_SCREEN_MAP: Record<EmployerTabName, keyof EmployerStackParamList> = {
	home: "EmployerHomeMain",
	worker: "WorkerManage",
	transfer: "RemittanceManage",
};

const EmployerWorkplaceManageScreen: React.FC = () => {
	const navigation =
		useNavigation<NativeStackNavigationProp<EmployerStackParamList>>();

	const [workplaces, setWorkplaces] = useState<WorkplaceListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleTabPress = (tab: EmployerTabName) => {
		navigation.replace(TAB_SCREEN_MAP[tab]);
	};

	useEffect(() => {
		const fetchWorkplaces = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await getWorkplaces();
				if (res.success && Array.isArray(res.data)) {
					setWorkplaces(res.data);
				} else {
					setWorkplaces([]);
					setError(res.error?.message || "사업장 정보를 불러오지 못했습니다.");
				}
			} catch (e: any) {
				setWorkplaces([]);
				setError(e?.message || "사업장 정보를 불러오지 못했습니다.");
			} finally {
				setLoading(false);
			}
		};
		fetchWorkplaces();
	}, []);

	return (
		<SafeAreaView style={styles.container} edges={["top"]}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<Text weight="ExtraBold" style={styles.title}>
					근무지 관리
				</Text>

				{loading ? (
					<ActivityIndicator
						size="large"
						color={colors.textSecondary}
						style={styles.loading}
					/>
				) : error ? (
					<Text style={styles.error}>{error}</Text>
				) : workplaces.length === 0 ? (
					<Text style={styles.empty}>등록된 사업장이 없습니다.</Text>
				) : (
					workplaces.map((w) => (
						<EmployerWorkplaceCard
							key={w.id}
							name={w.name}
							businessName={w.businessName}
							workerCount={w.workerCount ?? 0}
							colorCode={w.colorCode}
						/>
					))
				)}
			</ScrollView>
			<EmployerNavigationBar activeTab="home" onTabPress={handleTabPress} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: 20,
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	title: {
		fontSize: 24,
		color: colors.textPrimary,
		marginBottom: 20,
	},
	loading: {
		marginTop: 32,
	},
	error: {
		color: colors.deleteRed,
		textAlign: "center",
		marginTop: 24,
	},
	empty: {
		color: colors.textSecondary,
		textAlign: "center",
		marginTop: 24,
	},
});

export default EmployerWorkplaceManageScreen;
