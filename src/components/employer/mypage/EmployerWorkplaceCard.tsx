import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

export interface EmployerWorkplaceCardProps {
	name: string;
	workerCount: number;
	colorCode?: string;
	businessNumber?: string;
	address?: string;
	onDelete?: () => void;
}

const EmployerWorkplaceCard: React.FC<EmployerWorkplaceCardProps> = ({
	name,
	workerCount,
	colorCode,
	businessNumber,
	address,
	onDelete,
}) => {
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<View style={styles.nameRow}>
					{colorCode && (
						<View style={[styles.colorDot, { backgroundColor: colorCode }]} />
					)}
					<Text weight="Bold" style={styles.name}>
						{name}
					</Text>
				</View>
				{onDelete && (
					<TouchableOpacity onPress={onDelete} hitSlop={8}>
						<Ionicons name="trash-outline" size={20} color={colors.deleteRed} />
					</TouchableOpacity>
				)}
			</View>
			<Text style={styles.info}>직원 수: {workerCount}명</Text>
			<Text style={styles.info}>사업자번호: {businessNumber ?? "?"}</Text>
			<Text style={styles.info}>주소: {address ?? "?"}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 16,
		shadowColor: colors.black,
		shadowOpacity: 0.07,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 8,
		elevation: 3,
		marginBottom: 16,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	nameRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	colorDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	name: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	info: {
		fontSize: 14,
		color: colors.textSecondary,
		marginBottom: 4,
	},
});

export default EmployerWorkplaceCard;
