import type { WeekDay } from "../types/worker.types";

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
