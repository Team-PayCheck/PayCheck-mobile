import type { WheelPickerItem } from "../components/common/WheelPicker";

export const HOUR_ITEMS: WheelPickerItem[] = Array.from(
	{ length: 24 },
	(_, i) => ({
		label: String(i).padStart(2, "0"),
		value: i,
	})
);

export const MINUTE_ITEMS: WheelPickerItem[] = Array.from(
	{ length: 60 },
	(_, i) => ({
		label: String(i).padStart(2, "0"),
		value: i,
	})
);

export const BREAK_ITEMS: WheelPickerItem[] = Array.from(
	{ length: 7 },
	(_, i) => ({
		label: `${i * 10}`,
		value: i * 10,
	})
);

export const getDateItems = (
	baseDate?: string | Date
): WheelPickerItem[] => {
	const date = baseDate ? new Date(baseDate) : new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	return Array.from({ length: daysInMonth }, (_, i) => {
		const day = i + 1;
		return {
			label: `${month + 1}/${day}`,
			value: day,
		};
	});
};
