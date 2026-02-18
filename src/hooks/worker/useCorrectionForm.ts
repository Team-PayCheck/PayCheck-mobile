/**
 * 근무 기록 정정 요청(WorkerCorrectionRequestModal) 전용 폼 커스텀 훅
 * - 7개 폼 상태 관리 (시작/종료 날짜, 시작/종료 시간, 휴게 시간)
 * - WheelPicker 연동 (토글, 설정, 값 변경 처리)
 * - 기존 근무 데이터 파싱 및 변경 사항 감지
 * - API 제출용 데이터 조립 (buildSubmitData)
 */
import { useState, useMemo, useEffect } from "react";
import type { WheelPickerItem } from "../../components/common/WheelPicker";
import type { WorkItem } from "../../types/worker.types";
import {
	HOUR_ITEMS,
	MINUTE_ITEMS,
	BREAK_ITEMS,
	getDateItems,
} from "../../constants/pickerItems";

export type CorrectionPickerTarget =
	| "startDate"
	| "startHour"
	| "startMinute"
	| "endDate"
	| "endHour"
	| "endMinute"
	| "breakMinutes"
	| null;

interface PickerConfig {
	items: WheelPickerItem[];
	selectedValue: string | number;
	width: number;
}

interface CorrectionSubmitData {
	workRecordId: number;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes: number;
}

const parseWorkItem = (work: WorkItem) => {
	const workDate = new Date(work.workDate);
	const date = workDate.getDate();
	const month = workDate.getMonth() + 1;
	const [startH, startM] = work.startTime.split(":").map(Number);
	const [endH, endM] = work.endTime.split(":").map(Number);

	return {
		date,
		month,
		startHour: startH,
		startMinute: startM,
		endHour: endH,
		endMinute: endM,
		breakMinutes: work.breakMinutes ?? 0,
	};
};

const useCorrectionForm = (work: WorkItem | null, visible: boolean) => {
	const [correctedStartDate, setCorrectedStartDate] = useState(1);
	const [correctedStartHour, setCorrectedStartHour] = useState(0);
	const [correctedStartMinute, setCorrectedStartMinute] = useState(0);
	const [correctedEndDate, setCorrectedEndDate] = useState(1);
	const [correctedEndHour, setCorrectedEndHour] = useState(0);
	const [correctedEndMinute, setCorrectedEndMinute] = useState(0);
	const [correctedBreakMinutes, setCorrectedBreakMinutes] = useState(0);
	const [activePicker, setActivePicker] =
		useState<CorrectionPickerTarget>(null);

	const dateItems = useMemo(
		() => (work ? getDateItems(work.workDate) : []),
		[work]
	);

	const original = useMemo(
		() => (work ? parseWorkItem(work) : null),
		[work]
	);

	// 모달 열릴 때 정정 값을 기존 값으로 초기화
	useEffect(() => {
		if (visible && original) {
			setCorrectedStartDate(original.date);
			setCorrectedStartHour(original.startHour);
			setCorrectedStartMinute(original.startMinute);
			setCorrectedEndDate(original.date);
			setCorrectedEndHour(original.endHour);
			setCorrectedEndMinute(original.endMinute);
			setCorrectedBreakMinutes(original.breakMinutes);
			setActivePicker(null);
		}
	}, [visible, original]);

	// 변경 사항 감지
	const hasChanges = useMemo(() => {
		if (!original) return false;
		return (
			correctedStartDate !== original.date ||
			correctedStartHour !== original.startHour ||
			correctedStartMinute !== original.startMinute ||
			correctedEndDate !== original.date ||
			correctedEndHour !== original.endHour ||
			correctedEndMinute !== original.endMinute ||
			correctedBreakMinutes !== original.breakMinutes
		);
	}, [
		original,
		correctedStartDate,
		correctedStartHour,
		correctedStartMinute,
		correctedEndDate,
		correctedEndHour,
		correctedEndMinute,
		correctedBreakMinutes,
	]);

	const handlePickerChange = (value: string | number) => {
		switch (activePicker) {
			case "startDate":
				setCorrectedStartDate(value as number);
				break;
			case "startHour":
				setCorrectedStartHour(value as number);
				break;
			case "startMinute":
				setCorrectedStartMinute(value as number);
				break;
			case "endDate":
				setCorrectedEndDate(value as number);
				break;
			case "endHour":
				setCorrectedEndHour(value as number);
				break;
			case "endMinute":
				setCorrectedEndMinute(value as number);
				break;
			case "breakMinutes":
				setCorrectedBreakMinutes(value as number);
				break;
		}
	};

	const togglePicker = (target: CorrectionPickerTarget) => {
		setActivePicker(activePicker === target ? null : target);
	};

	const getPickerConfig = (): PickerConfig => {
		switch (activePicker) {
			case "startDate":
			case "endDate":
				return {
					items: dateItems,
					selectedValue:
						activePicker === "startDate"
							? correctedStartDate
							: correctedEndDate,
					width: 120,
				};
			case "startHour":
			case "endHour":
				return {
					items: HOUR_ITEMS,
					selectedValue:
						activePicker === "startHour"
							? correctedStartHour
							: correctedEndHour,
					width: 80,
				};
			case "startMinute":
			case "endMinute":
				return {
					items: MINUTE_ITEMS,
					selectedValue:
						activePicker === "startMinute"
							? correctedStartMinute
							: correctedEndMinute,
					width: 80,
				};
			case "breakMinutes":
				return {
					items: BREAK_ITEMS,
					selectedValue: correctedBreakMinutes,
					width: 80,
				};
			default:
				return { items: [], selectedValue: 0, width: 80 };
		}
	};

	const getDisplayValue = (target: CorrectionPickerTarget): string => {
		if (!original) return "";
		switch (target) {
			case "startDate":
				return `${original.month}/${correctedStartDate}`;
			case "startHour":
				return String(correctedStartHour).padStart(2, "0");
			case "startMinute":
				return String(correctedStartMinute).padStart(2, "0");
			case "endDate":
				return `${original.month}/${correctedEndDate}`;
			case "endHour":
				return String(correctedEndHour).padStart(2, "0");
			case "endMinute":
				return String(correctedEndMinute).padStart(2, "0");
			case "breakMinutes":
				return String(correctedBreakMinutes);
			default:
				return "";
		}
	};

	const buildSubmitData = (): CorrectionSubmitData | null => {
		if (!work || !hasChanges || !original) return null;

		const workDate = new Date(work.workDate);
		const year = workDate.getFullYear();
		const month = workDate.getMonth() + 1;
		const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(correctedStartDate).padStart(2, "0")}`;

		return {
			workRecordId: work.id,
			requestedWorkDate: dateStr,
			requestedStartTime: `${String(correctedStartHour).padStart(2, "0")}:${String(correctedStartMinute).padStart(2, "0")}`,
			requestedEndTime: `${String(correctedEndHour).padStart(2, "0")}:${String(correctedEndMinute).padStart(2, "0")}`,
			requestedBreakMinutes: correctedBreakMinutes,
		};
	};

	return {
		original,
		activePicker,
		hasChanges,
		handlePickerChange,
		togglePicker,
		getPickerConfig,
		getDisplayValue,
		buildSubmitData,
	};
};

export default useCorrectionForm;
