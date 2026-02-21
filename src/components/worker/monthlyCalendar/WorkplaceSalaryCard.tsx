import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/format";
import { Text } from "../../common/Text";

interface WorkplaceSalaryCardProps {
  workplaceName: string;
  baseSalary: number;
  deduction: number;
  maxSalary: number;
  status?: string;
}

const WorkplaceSalaryCard: React.FC<WorkplaceSalaryCardProps> = ({
  workplaceName,
  baseSalary,
  deduction,
  maxSalary,
  status = "송금 대기중",
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.workplaceName} weight="Bold">{workplaceName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText} weight="SemiBold">{status}</Text>
        </View>
      </View>
      <View style={styles.salaryRow}>
        <Text style={styles.label} weight="SemiBold">기본급여</Text>
        <Text style={styles.value} weight="SemiBold">{formatCurrency(baseSalary)}</Text>
      </View>
      <View style={styles.salaryRow}>
        <Text style={styles.label} weight="SemiBold">초과 및 기타 공제</Text>
        <Text style={styles.value} weight="SemiBold">{formatCurrency(deduction)}</Text>
      </View>
      <View style={styles.maxRow}>
        <Text style={styles.maxText} weight="SemiBold">최대 {formatCurrency(maxSalary)}원</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  workplaceName: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: colors.grey,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  salaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  value: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  maxRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  maxText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
});

export default WorkplaceSalaryCard;
