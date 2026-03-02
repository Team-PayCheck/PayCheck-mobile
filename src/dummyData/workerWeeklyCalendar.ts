import type { NoticeCardItem } from "../types/common/notice.types";

export const dummyNotices: NoticeCardItem[] = [
	{
		id: 1,
		category: "HANDOVER",
		title: "오전타임 변동 사항 공지사항",
		authorName: "사장님",
		createdAt: "2026-03-02T09:00:00",
	},
	{
		id: 2,
		category: "URGENT",
		title: "사장님 공지 : 위생사항 준수",
		authorName: "사장님",
		createdAt: "2026-03-02T12:00:00",
	},
	{
		id: 3,
		category: "ETC",
		title: "공업 교재 관리 안내",
		authorName: "관리자",
		createdAt: "2026-03-02T18:00:00",
	},
];
