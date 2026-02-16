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
	workplaceName: string;
	workplaceLogoUrl: string | null;
	date: string; // "1/24"
	startTime: string; // "17:00"
	endTime: string; // "19:00"
	status: WorkStatus;
	// 토글 펼침 시 표시되는 상세 정보
	workLocation: string; // 근무지 상세 ("정석학술정보관")
	breakMinutes: number; // 휴게 시간 (분)
	hourlyWage: number; // 시급
	totalWage: number; // 총 급여
}

export interface WeekDay {
	dayLabel: string; // "Mon", "Tue", ...
	date: number; // 21, 22, ...
	isToday: boolean;
}

export interface WeeklySummaryData {
	weekLabel: string; // "이번주(5주차)"
	totalHours: number;
	estimatedPay: number;
}
