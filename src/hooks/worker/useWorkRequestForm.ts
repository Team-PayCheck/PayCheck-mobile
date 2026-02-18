/**
 * 근무 추가 요청(AddWorkRequestModal) 전용 폼 커스텀 훅
 * - 7개 폼 상태 관리 (근무지, 날짜, 시작/종료 시간, 휴게 시간)
 * - WheelPicker 연동 (토글, 설정, 값 변경 처리)
 * - API 제출용 데이터 조립 (buildSubmitData)
 */
import { useState, useMemo } from "react";
import { Dimensions } from "react-native";
import type { WheelPickerItem } from "../../components/common/WheelPicker";
import {
	HOUR_ITEMS,
	MINUTE_ITEMS,
	BREAK_ITEMS,
	getDateItems,
} from "../../constants/pickerItems";

export type PickerTarget =
	| "workplace"
	| "date"
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

interface WorkRequestSubmitData {
	contractId: number;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const useWorkRequestForm = (workplacePickerItems: WheelPickerItem[]) => {
	const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<
		number | null
	>(null);
	const [selectedDate, setSelectedDate] = useState<number>(
		new Date().getDate()
	);
	const [startHour, setStartHour] = useState(0);
	const [startMinute, setStartMinute] = useState(0);
	const [endHour, setEndHour] = useState(0);
	const [endMinute, setEndMinute] = useState(0);
	const [breakMinutes, setBreakMinutes] = useState(0);
	const [activePicker, setActivePicker] = useState<PickerTarget>(null);

	const dateItems = useMemo(() => getDateItems(), []);

	const handlePickerChange = (value: string | number) => {
		switch (activePicker) {
			case "workplace":
				setSelectedWorkplaceId(value as number);
				break;
			case "date":
				setSelectedDate(value as number);
				break;
			case "startHour":
				setStartHour(value as number);
				break;
			case "startMinute":
				setStartMinute(value as number);
				break;
			case "endHour":
				setEndHour(value as number);
				break;
			case "endMinute":
				setEndMinute(value as number);
				break;
			case "breakMinutes":
				setBreakMinutes(value as number);
				break;
		}
	};

	const togglePicker = (target: PickerTarget) => {
		setActivePicker(activePicker === target ? null : target);
	};

	const getPickerConfig = (): PickerConfig => {
		switch (activePicker) {
			case "workplace":
				return {
					items: workplacePickerItems,
					selectedValue:
						selectedWorkplaceId ??
						(workplacePickerItems[0]?.value as number) ??
						0,
					width: SCREEN_WIDTH - 80,
				};
			case "date":
				return {
					items: dateItems,
					selectedValue: selectedDate,
					width: 120,
				};
			case "startHour":
			case "endHour":
				return {
					items: HOUR_ITEMS,
					selectedValue:
						activePicker === "startHour" ? startHour : endHour,
					width: 80,
				};
			case "startMinute":
			case "endMinute":
				return {
					items: MINUTE_ITEMS,
					selectedValue:
						activePicker === "startMinute"
							? startMinute
							: endMinute,
					width: 80,
				};
			case "breakMinutes":
				return {
					items: BREAK_ITEMS,
					selectedValue: breakMinutes,
					width: 80,
				};
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	};

	const getDisplayValue = (target: PickerTarget): string => {
		switch (target) {
			case "workplace":
				return "";
			case "date": {
				const month = new Date().getMonth() + 1;
				return `${month}/${selectedDate}`;
			}
			case "startHour":
				return String(startHour).padStart(2, "0");
			case "startMinute":
				return String(startMinute).padStart(2, "0");
			case "endHour":
				return String(endHour).padStart(2, "0");
			case "endMinute":
				return String(endMinute).padStart(2, "0");
			case "breakMinutes":
				return String(breakMinutes);
			default:
				return "";
		}
	};

	const buildSubmitData = (): WorkRequestSubmitData | null => {
		if (!selectedWorkplaceId) return null;

		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth() + 1;
		const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;

		return {
			contractId: selectedWorkplaceId,
			requestedWorkDate: dateStr,
			requestedStartTime: `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}`,
			requestedEndTime: `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
			requestedBreakMinutes: breakMinutes,
		};
	};

	return {
		selectedWorkplaceId,
		activePicker,
		breakMinutes,
		handlePickerChange,
		togglePicker,
		getPickerConfig,
		getDisplayValue,
		buildSubmitData,
	};
};

export default useWorkRequestForm;
