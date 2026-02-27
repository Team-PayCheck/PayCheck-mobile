import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import BaseRequestCard, { baseRequestCardStyles } from "../../mypage/BaseRequestCard";
import type {
	CorrectionRequestListItem,
	CorrectionRequestDetail,
} from "../../../api/employer/types";

interface ReceivedRequestCardProps {
	request: CorrectionRequestListItem;
	expanded: boolean;
	onToggle: () => void;
	detail: CorrectionRequestDetail | null;
	isDetailLoading: boolean;
	onApprove?: (id: number) => void;
	onReject?: (id: number) => void;
	isProcessing?: "approve" | "reject" | false;
}

const ReceivedRequestCard: React.FC<ReceivedRequestCardProps> = ({
	request,
	expanded,
	onToggle,
	detail,
	isDetailLoading,
	onApprove,
	onReject,
	isProcessing,
}) => {
	return (
		<BaseRequestCard
			request={request}
			headerSubtitle={request.requester.name}
			expanded={expanded}
			onToggle={onToggle}
			detail={detail}
			isDetailLoading={isDetailLoading}
			extraDetailFields={
				detail ? (
					<View>
						<Text style={baseRequestCardStyles.detailLabel}>요청자</Text>
						<View style={baseRequestCardStyles.detailValueBox}>
							<Text style={baseRequestCardStyles.detailValueText}>{detail.requester.name}</Text>
						</View>
					</View>
				) : undefined
			}
			actionButtons={
				request.status === "PENDING" ? (
					<View style={styles.actionRow}>
						<TouchableOpacity
							style={styles.rejectButton}
							onPress={() => onReject?.(request.id)}
							disabled={!!isProcessing}
							activeOpacity={0.7}
						>
							<Text weight="SemiBold" style={styles.rejectButtonText}>
								{isProcessing === "reject" ? "처리 중..." : "거절"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.approveButton}
							onPress={() => onApprove?.(request.id)}
							disabled={!!isProcessing}
							activeOpacity={0.7}
						>
							<Text weight="SemiBold" style={styles.approveButtonText}>
								{isProcessing === "approve" ? "처리 중..." : "승인"}
							</Text>
						</TouchableOpacity>
					</View>
				) : undefined
			}
		/>
	);
};

const styles = StyleSheet.create({
	actionRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 10,
		marginTop: 4,
	},
	rejectButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: colors.backgroundGrey,
		borderWidth: 1,
		borderColor: colors.border,
	},
	rejectButtonText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
	approveButton: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: colors.primary,
	},
	approveButtonText: {
		fontSize: 14,
		color: colors.white,
	},
});

export default ReceivedRequestCard;
