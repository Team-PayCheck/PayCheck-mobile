import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

interface WorkplaceTabSelectorProps {
	workplaceNames: string[];
	selectedIndex: number;
	onSelect: (index: number) => void;
}

const WorkplaceTabSelector: React.FC<WorkplaceTabSelectorProps> = ({
	workplaceNames,
	selectedIndex,
	onSelect,
}) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.container}
		>
			{workplaceNames.map((name, index) => {
				const isSelected = index === selectedIndex;
				return (
					<TouchableOpacity
						key={index}
						style={[styles.tab, isSelected && styles.tabSelected]}
						onPress={() => onSelect(index)}
					>
						<Text
							style={[
								styles.tabText,
								isSelected && styles.tabTextSelected,
							]}
							weight={isSelected ? "Bold" : "Regular"}
						>
							{name}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 20,
		paddingBottom: 4,
	},
	tab: {
		paddingVertical: 6,
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	tabSelected: {
		borderBottomColor: colors.primary,
	},
	tabText: {
		fontSize: 15,
		color: colors.textPrimary,
	},
	tabTextSelected: {
		color: colors.primary,
	},
});

export default WorkplaceTabSelector;
