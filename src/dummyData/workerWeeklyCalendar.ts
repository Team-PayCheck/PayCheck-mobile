import type { NoticeItem } from "../types/worker.types";

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
