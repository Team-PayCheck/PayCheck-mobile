import type {
	NoticeItem,
	WorkItem,
	WeekDay,
	WeeklySummaryData,
} from "../types/worker.types";

export const dummyWeekDays: WeekDay[] = [
	{ dayLabel: "Mon", date: 21, isToday: false },
	{ dayLabel: "Tue", date: 22, isToday: false, workStatus: "COMPLETED" },
	{ dayLabel: "Wed", date: 23, isToday: false },
	{ dayLabel: "Thu", date: 24, isToday: true },
	{ dayLabel: "Fri", date: 25, isToday: false, workStatus: "SCHEDULED" },
	{ dayLabel: "Sat", date: 26, isToday: false, workStatus: "SCHEDULED" },
	{ dayLabel: "Sun", date: 27, isToday: false },
];

export const dummyNotices: NoticeItem[] = [
	{
		id: 1,
		icon: require("../assets/images/notice/handover.png"),
		category: "인수인계",
		title: "오전타임 변동 사항 공지사항",
		author: "사장님",
		time: "09:00",
	},
	{
		id: 2,
		icon: require("../assets/images/notice/urgent.png"),
		category: "긴급공지",
		title: "사장님 공지 : 위생사항 준수",
		author: "사장님",
		time: "12:00",
	},
	{
		id: 3,
		icon: require("../assets/images/notice/etc.png"),
		category: "기타",
		title: "공업 교재 관리 안내",
		author: "관리자",
		time: "18:00",
	},
];

export const dummyWorks: WorkItem[] = [
	{
		id: 1,
		contractId: 10,
		workerName: "홍길동",
		workerCode: "W20240001",
		workplaceName: "교내근로",
		workDate: "2026-01-24",
		startTime: "17:00",
		endTime: "19:00",
		breakMinutes: 0,
		totalWorkMinutes: 120,
		status: "SCHEDULED",
		isModified: false,
		memo: "",
		baseSalary: 20600,
		nightSalary: 0,
		holidaySalary: 0,
		totalSalary: 20600,
	},
	{
		id: 2,
		contractId: 11,
		workerName: "홍길동",
		workerCode: "W20240001",
		workplaceName: "스타벅스 건대점",
		workDate: "2026-01-24",
		startTime: "10:00",
		endTime: "14:00",
		breakMinutes: 30,
		totalWorkMinutes: 210,
		status: "COMPLETED",
		isModified: false,
		memo: "오전 근무",
		baseSalary: 36050,
		nightSalary: 0,
		holidaySalary: 0,
		totalSalary: 36050,
	},
	{
		id: 3,
		contractId: 12,
		workerName: "홍길동",
		workerCode: "W20240001",
		workplaceName: "CU 화양점",
		workDate: "2026-01-25",
		startTime: "18:00",
		endTime: "22:00",
		breakMinutes: 0,
		totalWorkMinutes: 240,
		status: "SCHEDULED",
		isModified: false,
		memo: "",
		baseSalary: 41200,
		nightSalary: 0,
		holidaySalary: 0,
		totalSalary: 41200,
	},
];

export const dummyWeeklySummary: WeeklySummaryData = {
	weekLabel: "이번주(5주차)",
	totalHours: 24,
	estimatedPay: 320000,
};

export const dummyWeekTitle = "1월 5주차 근무";
