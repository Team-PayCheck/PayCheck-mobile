import { useState, useCallback, useMemo } from "react";
import { HOUR_ITEMS, MINUTE_ITEMS } from "../../constants/pickerItems";
import { getExpiresDateItems } from "../../utils/notice";
import type { WheelPickerItem } from "../../components/common/WheelPicker";

export type PickerTarget = "date" | "hour" | "minute" | null;

interface PickerConfig {
	items: WheelPickerItem[];
	selectedValue: string | number;
	width: number;
}

interface UsePickerStateOptions {
	includeToday?: boolean;
	initialDate?: string;
	initialHour?: number;
	initialMinute?: number;
}

export function usePickerState(options: UsePickerStateOptions = {}) {
	const {
		includeToday = false,
		initialDate = "",
		initialHour = 18,
		initialMinute = 0,
	} = options;

	const [expiresDate, setExpiresDate] = useState(initialDate);
	const [expiresHour, setExpiresHour] = useState(initialHour);
	const [expiresMinute, setExpiresMinute] = useState(initialMinute);
	const [activePicker, setActivePicker] = useState<PickerTarget>(null);

	const dateItems = useMemo(() => getExpiresDateItems(includeToday), [includeToday]);
	const defaultDate = dateItems[0]?.value as string;

	const togglePicker = useCallback(
		(target: PickerTarget) => {
			setActivePicker(activePicker === target ? null : target);
		},
		[activePicker]
	);

	const closePicker = useCallback(() => {
		setActivePicker(null);
	}, []);

	const handlePickerChange = useCallback(
		(value: string | number) => {
			switch (activePicker) {
				case "date":
					setExpiresDate(value as string);
					break;
				case "hour":
					setExpiresHour(value as number);
					break;
				case "minute":
					setExpiresMinute(value as number);
					break;
			}
		},
		[activePicker]
	);

	const pickerConfig: PickerConfig = useMemo(() => {
		switch (activePicker) {
			case "date":
				return {
					items: dateItems,
					selectedValue: expiresDate || defaultDate,
					width: 120,
				};
			case "hour":
				return { items: HOUR_ITEMS, selectedValue: expiresHour, width: 80 };
			case "minute":
				return { items: MINUTE_ITEMS, selectedValue: expiresMinute, width: 80 };
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	}, [activePicker, dateItems, expiresDate, defaultDate, expiresHour, expiresMinute]);

	const displayDate = useMemo(() => {
		const dateVal = expiresDate || defaultDate;
		const item = dateItems.find((d) => d.value === dateVal);
		return item?.label ?? (expiresDate ? expiresDate.slice(5).replace("-", "/") : "");
	}, [expiresDate, defaultDate, dateItems]);

	/** "YYYY-MM-DDThh:mm:00" 형태의 만료일시 문자열 생성 */
	const buildExpiresAt = useCallback((): string => {
		const dateVal = expiresDate || defaultDate;
		const hh = String(expiresHour).padStart(2, "0");
		const mm = String(expiresMinute).padStart(2, "0");
		return `${dateVal}T${hh}:${mm}:00`;
	}, [expiresDate, defaultDate, expiresHour, expiresMinute]);

	const resetPicker = useCallback(
		(date = "", hour = 18, minute = 0) => {
			setExpiresDate(date);
			setExpiresHour(hour);
			setExpiresMinute(minute);
			setActivePicker(null);
		},
		[]
	);

	return {
		expiresDate,
		expiresHour,
		expiresMinute,
		activePicker,
		dateItems,
		defaultDate,
		displayDate,
		pickerConfig,
		togglePicker,
		closePicker,
		handlePickerChange,
		buildExpiresAt,
		resetPicker,
		setExpiresDate,
		setExpiresHour,
		setExpiresMinute,
	};
}
