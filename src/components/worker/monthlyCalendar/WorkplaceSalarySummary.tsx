import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import WorkplaceSalaryCard from "./WorkplaceSalaryCard";
import { colors } from "../../../constants/colors";
import { Text } from "../../common/Text";

interface WorkplaceSalarySummaryProps {
  workplaces: Array<{
    workplaceName: string;
    baseSalary: number;
    deduction: number;
    maxSalary: number;
    status?: string;
  }>;
  onPressDetail?: () => void;
}

const WorkplaceSalarySummary: React.FC<WorkplaceSalarySummaryProps> = ({ workplaces, onPressDetail }) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerBox}>
        {workplaces.map((w, idx) => (
          <React.Fragment key={w.workplaceName}>
            {idx > 0 && <View style={styles.dashedLine} />}
            <WorkplaceSalaryCard {...w} />
          </React.Fragment>
        ))}
        <TouchableOpacity style={styles.detailBtn} onPress={onPressDetail}>
          <Text style={styles.detailText} weight="SemiBold">급여명세서 자세히보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  innerBox: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dashedLine: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailBtn: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: colors.blue,
  },
});

export default WorkplaceSalarySummary;
