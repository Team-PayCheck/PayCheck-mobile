import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface MonthlyCalendarProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  // 추후 workDots, onMonthChange 등 추가 가능
}

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  year,
  month,
  selectedDate,
  onDateSelect,
}) => {
  // 캘린더 그리드 생성 (해당 월이 포함된 주만)
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  type CalendarCell = { date: Date; type: 'prev' | 'current' | 'next' };
  const calendar: CalendarCell[][] = [];
  let day = 1;
  let nextMonthDay = 1;
  let weekIdx = 0;
  let done = false;
  while (!done) {
    const week: CalendarCell[] = [];
    for (let j = 0; j < 7; j++) {
      let cell: CalendarCell;
      if (weekIdx === 0 && j < firstDay) {
        cell = {
          date: new Date(year, month - 1, prevMonthLastDate - (firstDay - j - 1)),
          type: 'prev',
        };
      } else if (day > lastDate) {
        cell = {
          date: new Date(year, month + 1, nextMonthDay++),
          type: 'next',
        };
      } else {
        cell = {
          date: new Date(year, month, day++),
          type: 'current',
        };
      }
      week.push(cell);
    }
    // 이번 주에 이번 달 날짜가 하나라도 있으면 추가
    if (week.some(cell => cell.type === 'current')) {
      calendar.push(week);
    } else if (day > lastDate) {
      // 이번 달 날짜가 없고, 이미 이번 달을 다 채웠으면 종료
      done = true;
    }
    weekIdx++;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.calendarBox}>
        {/* 요일 헤더 */}
        <View style={styles.row}>
          {daysOfWeek.map((d, idx) => (
            <Text
              key={`dow-${idx}`}
              style={[
                styles.dayOfWeek,
                idx === 0 && { color: colors.red },
                idx === 6 && { color: colors.blue },
              ]}
              weight="Bold"
            >
              {d}
            </Text>
          ))}
        </View>
        {/* 날짜 그리드 */}
        {calendar.map((week, i) => (
          <View key={`week-${i}`} style={styles.row}>
            {week.map((cell, j) => {
              const { date, type } = cell;
              const isToday = (() => {
                const now = new Date();
                return (
                  date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate()
                );
              })();
              const isSelected =
                type === 'current' &&
                date.getFullYear() === selectedDate.getFullYear() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getDate() === selectedDate.getDate();
              const cellKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${type}-w${i}-c${j}`;
              return (
                <View key={cellKey} style={styles.cell}>
                  <Text
                    style={[
                      styles.dateText,
                      isToday && styles.todayCircle,
                      isSelected && !isToday && styles.selectedDate,
                      j === 0 && { color: colors.red },
                      j === 6 && { color: colors.blue },
                      type !== 'current' && styles.outsideMonth,
                    ]}
                    weight="SemiBold"
                    onPress={() => type === 'current' && onDateSelect(date)}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
  },
  calendarBox: {
    width: 320, 
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
  },
  dayOfWeek: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    maxWidth: 38,
  },
  dateText: {
    fontSize: 15,
    textAlign: "center",
    color: colors.textPrimary,
    padding: 4,
    borderRadius: 16,
    minWidth: 28,
    minHeight: 28,
    overflow: 'hidden',
  },
  selectedDate: {
    backgroundColor: colors.lightBlue, // 선택한 날: 하늘색
    color: colors.white,
  },
  todayCircle: {
    backgroundColor: colors.primary, // 오늘: 파란색
    color: colors.white,
  },
  // selectedOnToday 스타일 제거
  outsideMonth: {
    color: colors.textMuted,
  },
});

export default MonthlyCalendar;
