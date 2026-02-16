import type {
	NoticeItem,
	WorkItem,
	WeekDay,
	WeeklySummaryData,
} from "../types/worker.types";

export const dummyWeekDays: WeekDay[] = [
	{ dayLabel: "Mon", date: 21, isToday: false },
	{ dayLabel: "Tue", date: 22, isToday: false },
	{ dayLabel: "Wed", date: 23, isToday: false },
	{ dayLabel: "Thu", date: 24, isToday: true },
	{ dayLabel: "Fri", date: 25, isToday: false },
	{ dayLabel: "Sat", date: 26, isToday: false },
	{ dayLabel: "Sun", date: 27, isToday: false },
];

export const dummyNotices: NoticeItem[] = [
	{
		id: 1,
		icon: null,
		category: "전달사항",
		title: "오전타임 변동 사항 공지사항",
		author: "사장님",
		time: "09:00",
	},
	{
		id: 2,
		icon: null,
		category: "공지",
		title: "사장님 공지 : 위생사항 업수",
		author: "사장님",
		time: "12:00",
	},
	{
		id: 3,
		icon: null,
		category: "관리",
		title: "공업 교재 관리 안내",
		author: "관리자",
		time: "18:00",
	},
];

export const dummyWorks: WorkItem[] = [
	{
		id: 1,
		workplaceName: "교내근로",
		workplaceLogoUrl: null,
		date: "1/24",
		startTime: "17:00",
		endTime: "19:00",
		status: "SCHEDULED",
		workLocation: "정석학술정보관",
		breakMinutes: 0,
		hourlyWage: 10300,
		totalWage: 30900,
	},
	{
		id: 2,
		workplaceName: "스타벅스 건대점",
		workplaceLogoUrl: null,
		date: "1/24",
		startTime: "10:00",
		endTime: "14:00",
		status: "COMPLETED",
		workLocation: "스타벅스 건대입구역점",
		breakMinutes: 30,
		hourlyWage: 10300,
		totalWage: 36050,
	},
	{
		id: 3,
		workplaceName: "CU 화양점",
		workplaceLogoUrl: null,
		date: "1/25",
		startTime: "18:00",
		endTime: "22:00",
		status: "SCHEDULED",
		workLocation: "CU 화양사거리점",
		breakMinutes: 0,
		hourlyWage: 10300,
		totalWage: 41200,
	},
];

export const dummyWeeklySummary: WeeklySummaryData = {
	weekLabel: "이번주(5주차)",
	totalHours: 24,
	estimatedPay: 320000,
};

export const dummyWeekTitle = "1월 5주차 근무";
