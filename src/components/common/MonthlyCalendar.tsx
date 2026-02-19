import React from "react";
import { StyleSheet, View, Text } from "react-native";

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
  // 1일이 무슨 요일인지
  const firstDay = new Date(year, month, 1).getDay();
  // 해당 월의 마지막 날짜
  const lastDate = new Date(year, month + 1, 0).getDate();
  // 이전 달 마지막 날짜
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  // 6주(6행) * 7일(7열) 그리드 생성 (이전/다음 달 날짜 포함)
  type CalendarCell = { date: Date; type: 'prev' | 'current' | 'next' };
  const calendar: CalendarCell[][] = [];
  let day = 1;
  let nextMonthDay = 1;
  for (let i = 0; i < 6; i++) {
    const week: CalendarCell[] = [];
    for (let j = 0; j < 7; j++) {
      let cell: CalendarCell;
      if (i === 0 && j < firstDay) {
        // 이전 달
        cell = {
          date: new Date(year, month - 1, prevMonthLastDate - (firstDay - j - 1)),
          type: 'prev',
        };
      } else if (day > lastDate) {
        // 다음 달
        cell = {
          date: new Date(year, month + 1, nextMonthDay++),
          type: 'next',
        };
      } else {
        // 이번 달
        cell = {
          date: new Date(year, month, day++),
          type: 'current',
        };
      }
      week.push(cell);
    }
    calendar.push(week);
  }

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.row}>
        {daysOfWeek.map((d, idx) => (
          <Text
            key={d}
            style={[
              styles.dayOfWeek,
              (idx === 0 || idx === 6) && styles.weekend,
            ]}
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
            const isSelected =
              type === 'current' &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();
            const cellKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${type}`;
            return (
              <View key={cellKey} style={styles.cell}>
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.selectedDate,
                    (j === 0 || j === 6) && styles.weekend,
                    type !== 'current' && styles.outsideMonth,
                  ]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayOfWeek: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#222",
    fontWeight: "bold",
    marginBottom: 8,
  },
  weekend: {
    color: "#f38181",
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 15,
    textAlign: "center",
    color: "#222",
    padding: 4,
    borderRadius: 16,
  },
  selectedDate: {
    backgroundColor: "#769fcd",
    color: "#fff",
  },
  outsideMonth: {
    color: "#d3d3d3",
  },
});

export default MonthlyCalendar;
