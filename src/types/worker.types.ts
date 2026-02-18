// 근무 상태 (API 응답 기준: SCHEDULED, COMPLETED, DELETED만 존재)
export type WorkStatus = "SCHEDULED" | "COMPLETED" | "DELETED";

export interface NoticeItem {
	id: number;
	icon: any; // require() 이미지
	category: string; // "전달사항", "공지", "관리"
	title: string;
	author: string;
	time: string; // "09:00", "12:00" 등
}

export interface WorkItem {
	id: number;
	contractId: number;
	workerName: string;
	workerCode: string;
	workplaceName: string;
	workDate: string; // "2026-02-16"
	startTime: string; // "09:00"
	endTime: string; // "18:00"
	breakMinutes: number;
	totalWorkMinutes: number;
	status: WorkStatus;
	isModified: boolean;
	memo: string;
	baseSalary: number;
	nightSalary: number;
	holidaySalary: number;
	totalSalary: number;
	salary?: number; // 시급 (API 미제공, 임시 필드)
}

export interface WeekDay {
	dayLabel: string; // "Mon", "Tue", ...
	date: number; // 21, 22, ...
	isToday: boolean;
	workStatus?: WorkStatus; // 해당 날짜의 근무 상태 (API 응답 기반)
}

export interface WeeklySummaryData {
	weekLabel: string; // "이번주(5주차)"
	totalHours: number;
	estimatedPay: number;
}
