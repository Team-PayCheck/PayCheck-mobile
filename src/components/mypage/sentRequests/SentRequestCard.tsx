import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
} from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import BaseRequestCard from "../BaseRequestCard";
import type {
	CorrectionRequestResponse,
	CorrectionRequestData,
} from "../../../api/worker/types";

interface SentRequestCardProps {
	request: CorrectionRequestResponse;
	expanded: boolean;
	onToggle: () => void;
	detail: CorrectionRequestData | null;
	isDetailLoading: boolean;
	onDelete?: (id: number) => void;
	isDeleting?: boolean;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({
	request,
	expanded,
	onToggle,
	detail,
	isDetailLoading,
	onDelete,
	isDeleting,
}) => {
	const handleDelete = () => {
		Alert.alert("요청 취소", "이 요청을 취소하시겠습니까?", [
			{ text: "아니오", style: "cancel" },
			{ text: "취소하기", style: "destructive", onPress: () => onDelete?.(request.id) },
		]);
	};

	return (
		<BaseRequestCard
			request={request}
			headerSubtitle={request.workplaceName}
			expanded={expanded}
			onToggle={onToggle}
			detail={detail}
			isDetailLoading={isDetailLoading}
			actionButtons={
				request.status === "PENDING" && onDelete ? (
					<View style={styles.actionRow}>
						<TouchableOpacity onPress={handleDelete} disabled={isDeleting} activeOpacity={0.7}>
							<Text weight="Medium" style={styles.deleteText}>
								{isDeleting ? "취소 중..." : "요청 취소"}
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
		marginTop: 4,
	},
	deleteText: {
		color: colors.deleteRed,
		fontSize: 14,
	},
});

export default SentRequestCard;
