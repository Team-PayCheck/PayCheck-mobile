import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";
import WorkCard from "./WorkCard";
import { colors } from "../../../constants/colors";
import type { WorkItem } from "../../../types/worker.types";

/** StatusBadge와 동일한 로직으로 상태 우선순위 반환: 근무중(0) → 근무예정(1) → 근무완료(2) */
const getStatusPriority = (work: WorkItem): number => {
	const now = new Date();
	const [startH, startM] = work.startTime.split(":").map(Number);
	const [endH, endM] = work.endTime.split(":").map(Number);

	const start = new Date(`${work.workDate}T00:00:00`);
	start.setHours(startH, startM, 0, 0);

	const end = new Date(`${work.workDate}T00:00:00`);
	end.setHours(endH, endM, 0, 0);

	if (end <= start) end.setDate(end.getDate() + 1);

	const beforeStart = now < start;
	const working = !beforeStart && now <= end && work.status === "SCHEDULED";
	const isScheduled = beforeStart || (work.status === "SCHEDULED" && !working);

	if (working) return 0;
	if (isScheduled) return 1;
	return 2;
};

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

	const sortedWorks = [...works].sort((a, b) => {
		const priorityA = getStatusPriority(a);
		const priorityB = getStatusPriority(b);
		if (priorityA !== priorityB) return priorityA - priorityB;
		return a.startTime.localeCompare(b.startTime);
	});

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
