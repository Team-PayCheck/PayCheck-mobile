import { useState } from "react";
import { StyleSheet } from "react-native";
import { HOUR_ITEMS, MINUTE_ITEMS, BREAK_ITEMS } from "../../constants/pickerItems";
import { colors } from "../../constants/colors";
import type { WheelPickerItem } from "../../components/common/WheelPicker";

export type TimePickerTarget =
  | "startHour"
  | "startMinute"
  | "endHour"
  | "endMinute"
  | "breakMinutes"
  | null;

interface PickerConfig {
  items: WheelPickerItem[];
  selectedValue: string | number;
  width: number;
}

export const useWorkTimePicker = () => {
  const [startHour, setStartHour] = useState(9);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(18);
  const [endMinute, setEndMinute] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [activePicker, setActivePicker] = useState<TimePickerTarget>(null);

  const isNextDay = endHour * 60 + endMinute < startHour * 60 + startMinute;

  const togglePicker = (target: TimePickerTarget) => {
    setActivePicker((prev) => (prev === target ? null : target));
  };

  const handlePickerChange = (value: string | number) => {
    switch (activePicker) {
      case "startHour": setStartHour(value as number); break;
      case "startMinute": setStartMinute(value as number); break;
      case "endHour": setEndHour(value as number); break;
      case "endMinute": setEndMinute(value as number); break;
      case "breakMinutes": setBreakMinutes(value as number); break;
    }
  };

  const getPickerConfig = (): PickerConfig => {
    switch (activePicker) {
      case "startHour": return { items: HOUR_ITEMS, selectedValue: startHour, width: 80 };
      case "startMinute": return { items: MINUTE_ITEMS, selectedValue: startMinute, width: 80 };
      case "endHour": return { items: HOUR_ITEMS, selectedValue: endHour, width: 80 };
      case "endMinute": return { items: MINUTE_ITEMS, selectedValue: endMinute, width: 80 };
      case "breakMinutes": return { items: BREAK_ITEMS, selectedValue: breakMinutes, width: 80 };
      default: return { items: [], selectedValue: 0, width: 80 };
    }
  };

  const getDisplayValue = (target: Exclude<TimePickerTarget, null>): string => {
    switch (target) {
      case "startHour": return String(startHour).padStart(2, "0");
      case "startMinute": return String(startMinute).padStart(2, "0");
      case "endHour": return String(endHour).padStart(2, "0");
      case "endMinute": return String(endMinute).padStart(2, "0");
      case "breakMinutes": return String(breakMinutes);
    }
  };

  const resetTime = (sh = 9, sm = 0, eh = 18, em = 0, bm = 0) => {
    setStartHour(sh);
    setStartMinute(sm);
    setEndHour(eh);
    setEndMinute(em);
    setBreakMinutes(bm);
    setActivePicker(null);
  };

  return {
    startHour,
    startMinute,
    endHour,
    endMinute,
    breakMinutes,
    activePicker,
    setActivePicker,
    isNextDay,
    togglePicker,
    handlePickerChange,
    getPickerConfig,
    getDisplayValue,
    resetTime,
  };
};

export const workModalSharedStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeField: {
    flex: 0,
    minWidth: 48,
    paddingHorizontal: 8,
  },
  timeSeparator: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeTilde: {
    fontSize: 16,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallField: {
    flex: 0,
    minWidth: 52,
  },
  unitText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  selectFieldActive: {
    borderColor: colors.primary,
  },
  selectText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  pickerArea: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    marginBottom: 12,
  },
  pickerWrapper: {
    alignItems: "center",
  },
  submitRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  nextDayRow: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  nextDayBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  nextDayText: {
    fontSize: 11,
    color: colors.primary,
  },
});
