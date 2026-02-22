import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface CalendarCellProps {
  date: Date;
  type: 'prev' | 'current' | 'next';
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  onPress: (date: Date) => void;
  dotInfo?: {
    count: number;
    hasCorrectionRequest: boolean;
  };
}

// 개별 날짜 셀: 날짜, 오늘/선택여부, 점 표시
const CalendarCell: React.FC<CalendarCellProps> = ({
  date,
  type,
  isToday,
  isSelected,
  isWeekend,
  onPress,
  dotInfo,
}) => {
  return (
    <TouchableOpacity
      style={styles.cell}
      activeOpacity={type === 'current' ? 0.7 : 1}
      disabled={type !== 'current'}
      onPress={() => type === 'current' && onPress(date)}
    >
      {/* 날짜 숫자 및 스타일 */}
      <Text
        style={[
          styles.dateText,
          isWeekend && !isToday && !isSelected && (date.getDay() === 0 ? { color: colors.red } : { color: colors.blue }),
          type !== 'current' && styles.outsideMonth,
          isSelected && !isToday && styles.selectedDate,
          isToday && styles.todayCircle,
        ]}
        weight="SemiBold"
        selectable={false}
        suppressHighlighting={true}
      >
        {date.getDate()}
      </Text>
      {/* 근무 점(최대 3개, 빨간/파란색) */}
      <View style={styles.dotRow}>
        {dotInfo && dotInfo.count > 0 &&
          Array.from({ length: Math.min(dotInfo.count, 3) }, (_, k) => (
            <View
              key={k}
              style={[
                styles.dot,
                k === 0 && dotInfo.hasCorrectionRequest ? styles.dotRed : styles.dotBlue,
              ]}
            />
          ))
        }
      </View>
    </TouchableOpacity>
  );
};


interface MonthlyCalendarProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  workDots?: {
    [dateKey: string]: {
      count: number;
      hasCorrectionRequest: boolean;
    };
  };
}

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

// 월간 캘린더 전체: 요일 헤더, 날짜 셀 그리드
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  year,
  month,
  selectedDate,
  onDateSelect,
  workDots,
}) => {
  // 캘린더 셀 2차원 배열 생성 (이전/다음달 포함)
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  type CalendarCellType = { date: Date; type: 'prev' | 'current' | 'next' };
  const calendar: CalendarCellType[][] = [];
  let day = 1;
  let nextMonthDay = 1;
  let weekIdx = 0;
  let done = false;
  while (!done) {
    const week: CalendarCellType[] = [];
    for (let j = 0; j < 7; j++) {
      let cell: CalendarCellType;
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
        {/* 날짜 셀 그리드 */}
        {calendar.map((week, i) => (
          <View key={`week-${i}`} style={styles.row}>
            {week.map((cell, j) => {
              const { date, type } = cell;
              // 오늘/선택여부 계산
              const isToday = (() => {
                const now = new Date();
                return (
                  date.getFullYear() === now.getFullYear() &&
                  date.getMonth() === now.getMonth() &&
                  date.getDate() === now.getDate()
                );
              })();
              const isSelected =
                selectedDate !== null &&
                type === 'current' &&
                date.getFullYear() === selectedDate.getFullYear() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getDate() === selectedDate.getDate();
              const isWeekend = j === 0 || j === 6;
              // YYYY-MM-DD 포맷 키
              const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              // workDots에서 해당 날짜 정보 조회
              const dotInfo = type === 'current' ? workDots?.[dateKey] : undefined;
              return (
                <CalendarCell
                  key={dateKey + '-' + type + '-w' + i + '-c' + j}
                  date={date}
                  type={type}
                  isToday={isToday}
                  isSelected={isSelected}
                  isWeekend={isWeekend}
                  onPress={onDateSelect}
                  dotInfo={dotInfo}
                />
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
    marginBottom: 7,
  },
  dayOfWeek: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 7,
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
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 8,
  },
  outsideMonth: {
    color: colors.textMuted,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 1,
  },
  dotBlue: {
    backgroundColor: colors.blue,
  },
  dotRed: {
    backgroundColor: colors.red,
  },
});

export default MonthlyCalendar;
