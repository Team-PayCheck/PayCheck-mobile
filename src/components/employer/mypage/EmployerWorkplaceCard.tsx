import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

export interface EmployerWorkplaceCardProps {
	name: string;
	businessName: string;
	workerCount: number;
	colorCode?: string;
	businessNumber?: string;
	address?: string;
}

const EmployerWorkplaceCard: React.FC<EmployerWorkplaceCardProps> = ({
	name,
	businessName,
	workerCount,
	colorCode,
	businessNumber,
	address,
}) => {
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				{colorCode && (
					<View style={[styles.colorDot, { backgroundColor: colorCode }]} />
				)}
				<Text weight="Bold" style={styles.name}>
					{name}
				</Text>
			</View>
			<Text style={styles.info}>사업자명: {businessName}</Text>
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
		marginBottom: 10,
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
