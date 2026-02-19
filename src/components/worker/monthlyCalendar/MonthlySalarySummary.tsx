import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";

interface MonthlySalarySummaryProps {
  monthLabel: string;
  totalHours: number;
  estimatedPay: number;
}

const MonthlySalarySummary: React.FC<MonthlySalarySummaryProps> = ({ monthLabel, totalHours, estimatedPay }) => {
  return (
        <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
            <Text weight="Bold" style={styles.headerTitle}>
                급여
            </Text>
        </View>
        <View style={styles.row}>
            <Text weight="Medium" style={styles.label}>
            {monthLabel} 총 근무시간
            </Text>
            <Text weight="Bold" style={styles.value}>
            {totalHours}시간
            </Text>
        </View>
        <View style={styles.row}>
            <Text weight="Medium" style={styles.label}>
            이번 달 예상 근무비
            </Text>
            <Text weight="Bold" style={styles.value}>
            {formatCurrency(estimatedPay)}원
            </Text>
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
  row: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 20,
    color: colors.textPrimary,
  },
});

export default MonthlySalarySummary;
