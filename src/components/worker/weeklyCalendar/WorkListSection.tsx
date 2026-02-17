import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";
import WorkCard from "./WorkCard";
import { colors } from "../../../constants/colors";
import type { WorkItem } from "../../../types/worker.types";

interface WorkListSectionProps {
	works: WorkItem[];
	onPressAdd?: () => void;
	onPressCorrectionRequest?: (work: WorkItem) => void;
}

const WorkListSection: React.FC<WorkListSectionProps> = ({
	works,
	onPressAdd,
	onPressCorrectionRequest,
}) => {
	const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

	const sortedWorks = [...works].sort((a, b) => b.startTime.localeCompare(a.startTime));

	const handleToggle = (work: WorkItem) => {
		setExpandedCardId((prev) => (prev === work.id ? null : work.id));
	};

	return (
		<View style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<Text weight="Bold" style={styles.headerTitle}>
					이번 주 근무 리스트
				</Text>
				<TouchableOpacity
					style={styles.addButton}
					onPress={onPressAdd}
					activeOpacity={0.7}
				>
					<Text weight="SemiBold" style={styles.addButtonText}>
						+ 근무 추가
					</Text>
				</TouchableOpacity>
			</View>

			{/* 근무 카드 리스트 */}
			<View style={styles.cardList}>
				{sortedWorks.map((work) => (
					<WorkCard
						key={work.id}
						work={work}
						isExpanded={expandedCardId === work.id}
						onPressToggle={handleToggle}
						onPressCorrectionRequest={onPressCorrectionRequest}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerTitle: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	addButton: {
		backgroundColor: colors.blue,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 14,
	},
	addButtonText: {
		fontSize: 12,
		color: colors.white,
	},
	cardList: {
		gap: 10,
	},
});

export default WorkListSection;
