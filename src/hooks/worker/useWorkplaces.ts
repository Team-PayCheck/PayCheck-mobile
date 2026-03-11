/**
 * 근로자의 활성 근무지 목록을 조회하는 커스텀 훅
 * - 계약 목록 응답에서 근무지명, 시급 정보를 직접 사용
 * - WheelPicker용 items 변환까지 포함
 */
import { useState, useMemo, useCallback } from "react";
import { getContracts } from "../../api/worker";
import type { WheelPickerItem } from "../../components/common/WheelPicker";

export interface WorkplaceOption {
	contractId: number;
	workplaceId: number;
	workplaceName: string;
	hourlyWage: number;
}

const useWorkplaces = () => {
	const [workplaces, setWorkplaces] = useState<WorkplaceOption[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchWorkplaces = useCallback(async () => {
		setIsLoading(true);
		try {
			const contractsRes = await getContracts();
			const activeContracts =
				contractsRes.data?.filter((c) => c.isActive) ?? [];

			const details = activeContracts.map((contract) => ({
				contractId: contract.id,
				workplaceId: contract.workplaceId,
				workplaceName: contract.workplaceName,
				hourlyWage: contract.hourlyWage,
			}));

			setWorkplaces(details);
		} catch {
			setWorkplaces([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const workplacePickerItems: WheelPickerItem[] = useMemo(
		() =>
			workplaces.map((wp) => ({
				label: wp.workplaceName,
				value: wp.contractId,
			})),
		[workplaces]
	);

	return { workplaces, isLoading, fetchWorkplaces, workplacePickerItems };
};

export default useWorkplaces;
