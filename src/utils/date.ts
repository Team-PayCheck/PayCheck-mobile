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

export const getWeekDays = (baseDate: Date): WeekDay[] => {
	const dayOfWeek = baseDate.getDay(); // 0(일) ~ 6(토)
	const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

	const monday = new Date(baseDate);
	monday.setDate(baseDate.getDate() + mondayOffset);

	const todayStr = baseDate.toDateString();

	return DAY_LABELS.map((label, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return {
			dayLabel: label,
			date: d.getDate(),
			isToday: d.toDateString() === todayStr,
		};
	});
};
