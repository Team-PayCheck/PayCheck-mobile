// ============ 사업장(근무지) 관련 타입 ============

/** 사업장 목록 아이템 (GET /api/employer/workplaces) */
export interface WorkplaceListItem {
	id: number;
	businessName: string;
	name: string;
	colorCode?: string;
	workerCount?: number;
	isActive?: boolean;
}

/** 사업장 상세 (GET /api/employer/workplaces/{id}) */
export interface WorkplaceDetail {
	id: number;
	businessNumber: string;
	businessName: string;
	name: string;
	address: string;
	colorCode?: string;
	isLessThanFiveEmployees: boolean;
	workerCount: number;
	isActive: boolean;
}
