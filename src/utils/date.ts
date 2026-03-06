import type { WeekDay } from "../types/worker.types";

/**
 * ISO 8601 날짜 문자열을 상대 시간 표기로 변환
 * e.g. "방금 전", "10분 전", "3시간 전", "2일 전", "3/15"
 */
export const formatRelativeTime = (dateStr: string): string => {
	const now = new Date();
	const date = new Date(dateStr);
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / (1000 * 60));
	const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMin < 1) return "방금 전";
	if (diffMin < 60) return `${diffMin}분 전`;
	if (diffHour < 24) return `${diffHour}시간 전`;
	if (diffDay < 7) return `${diffDay}일 전`;

	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${month}/${day}`;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getWeekOfMonth = (date: Date): number => {
	return Math.ceil(date.getDate() / 7);
};

export const getWeekTitle = (date: Date): string => {
	const month = date.getMonth() + 1;
	const week = getWeekOfMonth(date);
	return `${month}월 ${week}주차 근무`;
};

export const getWeekLabel = (date: Date): string => {
	const week = getWeekOfMonth(date);
	return `이번주(${week}주차)`;
};

export const formatDateStr = (date: Date): string => {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

export const getWeekRange = (
	baseDate: Date
): { startDate: string; endDate: string } => {
	const dayOfWeek = baseDate.getDay();
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

	const monday = new Date(baseDate);
	monday.setDate(baseDate.getDate() + mondayOffset);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);

	return {
		startDate: formatDateStr(monday),
		endDate: formatDateStr(sunday),
	};
};

export const getWeekDays = (baseDate: Date): WeekDay[] => {
	const dayOfWeek = baseDate.getDay(); // 0(일) ~ 6(토)
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

	const monday = new Date(baseDate);
	monday.setDate(baseDate.getDate() + mondayOffset);

	const todayStr = baseDate.toDateString();

	const todayStart = new Date(baseDate);
	todayStart.setHours(0, 0, 0, 0);

	return DAY_LABELS.map((label, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		d.setHours(0, 0, 0, 0);
		return {
			dayLabel: label,
			date: d.getDate(),
			isToday: d.toDateString() === todayStr,
			isPast: d.getTime() < todayStart.getTime(),
		};
	});
};
