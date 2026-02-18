import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

export interface WorkplaceCardProps {
  name: string;
  joinedAt: string;
  wage: string;
  style?: object;
}

const WorkplaceCard: React.FC<WorkplaceCardProps> = ({ name, joinedAt, wage, style }) => {
  return (
    <View style={[styles.card, style]}>
      <Text weight="Bold" style={styles.cardLabel}>
        근무지: <Text weight="Bold" style={styles.cardValue}>{name}</Text>
      </Text>
      <Text weight="Bold" style={styles.cardLabel}>
        입사 날짜: <Text weight="Bold" style={styles.cardValue}>{joinedAt}</Text>
      </Text>
      <Text weight="Bold" style={styles.cardLabel}>
        시급: <Text weight="Bold" style={styles.cardValue}>{wage}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: colors.black,
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    height: 100,
  },
  cardLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  cardValue: {
    color: colors.textPrimary,
  },
});

export default WorkplaceCard;
