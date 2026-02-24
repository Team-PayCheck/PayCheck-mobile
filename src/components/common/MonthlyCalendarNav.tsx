import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { Text } from "../common/Text";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { WorkerStackParamList } from "../../navigation/WorkerStack";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthlyCalendarNavProps {
  year: number;
  month: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
  hideListView?: boolean;
}

const MonthlyCalendarNav: React.FC<MonthlyCalendarNavProps> = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  hideListView = false,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<WorkerStackParamList>>();
  const handleWeeklyView = () => {
    navigation.replace("WorkerHomeMain");
  };
  return (
    <View style={styles.monthNavRow}>
      <TouchableOpacity onPress={onPrevMonth} style={styles.iconBtn}>
        <Ionicons name="chevron-back-outline" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.monthLabelBox}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text weight="Bold" style={styles.monthNumber}>{month + 1}월</Text>
          <Text weight="Regular" style={styles.monthEng}>{' '}{monthNames[month]}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onNextMonth} style={styles.iconBtn}>
        <Ionicons name="chevron-forward-outline" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      {!hideListView && (
        <TouchableOpacity style={styles.iconBtn} onPress={handleWeeklyView}>
          <Feather name="list" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  monthNavRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -10,
  },
  iconBtn: {
    padding: 4,
  },
  monthLabelBox: {
    marginHorizontal: 8,
  },
  monthNumber: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  monthEng: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 1,
  },
});

export default MonthlyCalendarNav;
