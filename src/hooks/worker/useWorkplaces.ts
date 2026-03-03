/**
 * 근로자의 활성 근무지 목록을 조회하는 커스텀 훅
 * - 계약 목록 → 상세 조회를 통해 근무지명, 시급 정보를 가공
 * - WheelPicker용 items 변환까지 포함
 */
import { useState, useMemo, useCallback } from "react";
import { getContracts, getContractDetail } from "../../api/worker";
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

			const details = await Promise.all(
				activeContracts.map(async (contract) => {
					const detailRes = await getContractDetail(contract.id);
					return {
						contractId: contract.id,
						workplaceId: detailRes.data?.workplaceId ?? 0,
						workplaceName:
							detailRes.data?.workplaceName ?? "알 수 없음",
						hourlyWage: detailRes.data?.hourlyWage ?? 0,
					};
				})
			);

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
