import type { WheelPickerItem } from "../components/common/WheelPicker";

/**
 * 만료일 선택용 날짜 아이템 생성.
 * @param includeToday true면 오늘부터, false면 내일부터 60일간 생성
 */
export const getExpiresDateItems = (
	includeToday = false
): WheelPickerItem[] => {
	const items: WheelPickerItem[] = [];
	const today = new Date();
	const startDay = includeToday ? 0 : 1;

	for (let i = startDay; i <= 60; i++) {
		const d = new Date(today);
		d.setDate(today.getDate() + i);
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		items.push({
			label: `${d.getMonth() + 1}/${d.getDate()}`,
			value: `${yyyy}-${mm}-${dd}`,
		});
	}
	return items;
};

/** ISO 문자열에서 날짜 부분 추출 "YYYY-MM-DD" */
export const extractDate = (iso: string): string => iso.slice(0, 10);

/** ISO 문자열에서 시 추출 */
export const extractHour = (iso: string): number => new Date(iso).getHours();

/** ISO 문자열에서 분 추출 */
export const extractMinute = (iso: string): number =>
	new Date(iso).getMinutes();
