import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency, formatDate } from "../../../utils/format";
import type { WorkItem } from "../../../types/worker.types";

interface WorkCardProps {
	work: WorkItem;
	isExpanded: boolean;
	onPressToggle?: (work: WorkItem) => void;
	onPressCorrectionRequest?: (work: WorkItem) => void;
}

const StatusBadge: React.FC<{ status: WorkItem["status"] }> = ({ status }) => {
	const isScheduled = status === "SCHEDULED";
	return (
		<View
			style={[
				styles.statusBadge,
				isScheduled ? styles.statusScheduled : styles.statusCompleted,
			]}
		>
			<Text
				weight="SemiBold"
				style={[
					styles.statusText,
					isScheduled
						? styles.statusTextScheduled
						: styles.statusTextCompleted,
				]}
			>
				{isScheduled ? "근무예정" : "근무완료"}
			</Text>
		</View>
	);
};

const WorkCard: React.FC<WorkCardProps> = ({
	work,
	isExpanded,
	onPressToggle,
	onPressCorrectionRequest,
}) => {
	return (
		<View style={styles.card}>
			{/* 접힌 상태 - 항상 표시 */}
			<TouchableOpacity
				style={styles.cardHeader}
				onPress={() => onPressToggle?.(work)}
				activeOpacity={0.7}
			>
				<View style={styles.logoContainer}>
					<Text weight="Bold" style={styles.logoText}>
						{work.workplaceName.charAt(0)}
					</Text>
				</View>
				<View style={styles.headerInfo}>
					<Text weight="SemiBold" style={styles.workplaceName}>
						{work.workplaceName}
					</Text>
					<Text weight="Bold" style={styles.dateTime}>
						{formatDate(work.workDate)} {work.startTime.slice(0, 5)} ~ {work.endTime.slice(0, 5)}
					</Text>
				</View>
				<View style={styles.headerRight}>
					<StatusBadge status={work.status} />
					<Feather
						name={isExpanded ? "chevron-up" : "chevron-down"}
						size={20}
						color={colors.black}
					/>
				</View>
			</TouchableOpacity>

			{/* 펼친 상태 - 토글 시 표시 */}
			{isExpanded && (
				<View style={styles.expandedContent}>
					<View style={styles.detailRow}>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>근무지</Text>
							<View style={styles.detailValueBox}>
								<Text weight="Medium" style={styles.detailValue}>
									{work.workplaceName}
								</Text>
							</View>
						</View>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>휴게 시간</Text>
							<View style={styles.detailValueBox}>
								<Text weight="Medium" style={styles.detailValue}>
									{work.breakMinutes ?? 0} 분
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.detailRow}>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>시급</Text>
							<View style={styles.detailValueBox}>
								<Text weight="Medium" style={styles.detailValue}>
									{work.salary != null ? `${formatCurrency(work.salary)} 원` : "? 원"}
								</Text>
							</View>
						</View>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>총 급여</Text>
							<View style={styles.detailValueBox}>
								<Text weight="Medium" style={styles.detailValue}>
									{formatCurrency(work.totalSalary ?? 0)} 원
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.correctionRow}>
						<TouchableOpacity
							style={styles.correctionButton}
							onPress={() => onPressCorrectionRequest?.(work)}
							activeOpacity={0.7}
						>
							<Feather name="edit-2" size={14} color={colors.textSecondary} />
							<Text weight="Medium" style={styles.correctionText}>
								근무기록 정정요청
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderRadius: 16,
		padding: 16,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 4,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	logoContainer: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: colors.backgroundGrey,
		alignItems: "center",
		justifyContent: "center",
	},
	logoText: {
		fontSize: 16,
		color: colors.textSecondary,
	},
	headerInfo: {
		flex: 1,
		gap: 2,
	},
	workplaceName: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	dateTime: {
		fontSize: 13,
		color: colors.textPrimary,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 10,
	},
	statusScheduled: {
		backgroundColor: colors.green,
	},
	statusCompleted: {
		backgroundColor: colors.grey,
	},
	statusText: {
		fontSize: 11,
	},
	statusTextScheduled: {
		color: colors.white,
	},
	statusTextCompleted: {
		color: colors.textSecondary,
	},
	expandedContent: {
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: colors.borderLight,
		gap: 12,
	},
	detailRow: {
		flexDirection: "row",
		gap: 12,
	},
	detailItem: {
		flex: 1,
		gap: 6,
	},
	detailLabel: {
		fontSize: 12,
		color: colors.textMuted,
	},
	detailValueBox: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		padding: 10,
	},
	detailValue: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	correctionRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 4,
	},
	correctionButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 20,
	},
	correctionText: {
		fontSize: 13,
		color: colors.textSecondary,
	},
});

export default WorkCard;
