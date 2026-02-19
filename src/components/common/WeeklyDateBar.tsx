import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors } from "../../constants/colors";
import type { WeekDay } from "../../types/worker.types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { WorkerStackParamList } from "../../navigation/WorkerStack";

interface WeeklyDateBarProps {
	weekTitle: string;
	weekDays: WeekDay[];
	selectedDate?: number;
	onPressCalendarIcon?: () => void;
	onPressDay?: (day: WeekDay) => void;
}

const WeeklyDateBar: React.FC<WeeklyDateBarProps> = ({
	weekTitle,
	weekDays,
	selectedDate,
	onPressCalendarIcon,
	onPressDay,
}) => {
	const navigation = useNavigation<NativeStackNavigationProp<WorkerStackParamList>>();
	const getIsSelected = (day: WeekDay) => {
		if (selectedDate !== undefined) {
			return day.date === selectedDate;
		}
		return day.isToday;
	};

	const handleCalendarIcon = () => {
		if (onPressCalendarIcon) {
			onPressCalendarIcon();
		} else {
			navigation.navigate("WorkerMonthlyCalendar");
		}
	};

	return (
		<View style={styles.container}>
			{/* 타이틀 행 */}
			<View style={styles.titleRow}>
				<Text weight="ExtraBold" style={styles.weekTitle}>
					{weekTitle}
				</Text>
				<TouchableOpacity onPress={handleCalendarIcon} activeOpacity={0.7}>
					<Feather name="calendar" size={22} color={colors.textPrimary} />
				</TouchableOpacity>
			</View>

			{/* 요일/날짜 카드 행 */}
			<View style={styles.daysRow}>
				{weekDays.map((day) => {
					const isToday = getIsSelected(day);
					const hasScheduled = !isToday && day.workStatus === "SCHEDULED";
					const hasCompleted = !isToday && day.workStatus === "COMPLETED";
					return (
						<TouchableOpacity
							key={day.date}
							style={[
								styles.dayCard,
								isToday && styles.dayCardToday,
								hasScheduled && styles.dayCardScheduled,
								hasCompleted && styles.dayCardCompleted,
							]}
							onPress={() => onPressDay?.(day)}
							activeOpacity={0.7}
						>
							<Text
								weight={isToday ? "Bold" : "Medium"}
								style={[
									styles.dayLabel,
									isToday && styles.textToday,
								]}
							>
								{day.dayLabel}
							</Text>
							<Text
								weight={isToday ? "Bold" : "SemiBold"}
								style={[
									styles.dateText,
									isToday && styles.textToday,
								]}
							>
								{day.date}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	titleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	weekTitle: {
		fontSize: 20,
		color: colors.textPrimary,
	},
	daysRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 8,
	},
	dayCard: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 12,
		gap: 6,
		backgroundColor: colors.white,
		borderRadius: 12,
		shadowColor: colors.black,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
	},
	dayCardToday: {
		backgroundColor: colors.primary,
	},
	dayCardScheduled: {
		backgroundColor: colors.mint,
	},
	dayCardCompleted: {
		backgroundColor: colors.grey,
	},
	dayLabel: {
		fontSize: 12,
		color: colors.textMuted,
	},
	dateText: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	textToday: {
		color: colors.white,
	},
});

export default WeeklyDateBar;
