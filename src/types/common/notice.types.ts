import type { NoticeCategory } from "../../api/notice/types";

/** 카테고리 한글 라벨 매핑 */
export const NOTICE_CATEGORY_LABEL: Record<NoticeCategory, string> = {
	HANDOVER: "인수인계",
	URGENT: "긴급공지",
	SCHEDULE: "일정",
	ETC: "기타",
};

/** 공지 카드 (리스트용) - NoticeBoard / NoticeCard에서 사용 */
export interface NoticeCardItem {
	id: number;
	category: NoticeCategory;
	title: string;
	authorName: string;
	createdAt: string; // ISO 8601
}
