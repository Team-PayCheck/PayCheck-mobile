/**
 * 근무 추가 요청(CREATE) 및 근무 기록 정정 요청(UPDATE) 모달의
 * 상태 관리와 API 호출을 담당하는 훅.
 * 주간캘린더, 월간캘린더 등 여러 스크린에서 재사용 가능.
 */
import { useState, useCallback } from "react";
import { createCorrectionRequest } from "../../api/worker";
import { showSuccess, showError } from "../../utils/alert";
import type { WorkItem } from "../../types/worker.types";

const useCorrectionRequest = () => {
	// 정정 요청 모달 상태
	const [correctionModalVisible, setCorrectionModalVisible] = useState(false);
	const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);

	// 근무 추가 모달 상태
	const [addModalVisible, setAddModalVisible] = useState(false);

	const openCorrectionModal = useCallback((work: WorkItem) => {
		setSelectedWork(work);
		setCorrectionModalVisible(true);
	}, []);

	const closeCorrectionModal = useCallback(() => {
		setCorrectionModalVisible(false);
	}, []);

	const openAddModal = useCallback(() => {
		setAddModalVisible(true);
	}, []);

	const closeAddModal = useCallback(() => {
		setAddModalVisible(false);
	}, []);

	const handleCorrectionSubmit = useCallback(
		async (data: {
			workRecordId: number;
			requestedWorkDate: string;
			requestedStartTime: string;
			requestedEndTime: string;
			requestedBreakMinutes: number;
		}) => {
			try {
				await createCorrectionRequest({
					type: "UPDATE",
					...data,
				});
				setCorrectionModalVisible(false);
				showSuccess("요청 완료", "근무 기록 정정 요청이 전송되었습니다.");
			} catch {
				showError("요청 실패", "요청에 실패했습니다. 다시 시도해주세요.");
			}
		},
		[]
	);

	const handleAddWorkSubmit = useCallback(
		async (data: {
			contractId: number;
			requestedWorkDate: string;
			requestedStartTime: string;
			requestedEndTime: string;
			requestedBreakMinutes: number;
		}) => {
			try {
				await createCorrectionRequest({
					type: "CREATE",
					...data,
				});
				setAddModalVisible(false);
				showSuccess("요청 완료", "근무 추가 요청이 전송되었습니다.");
			} catch {
				showError("요청 실패", "요청에 실패했습니다. 다시 시도해주세요.");
			}
		},
		[]
	);

	return {
		// 정정 요청
		correctionModalVisible,
		selectedWork,
		openCorrectionModal,
		closeCorrectionModal,
		handleCorrectionSubmit,

		// 근무 추가
		addModalVisible,
		openAddModal,
		closeAddModal,
		handleAddWorkSubmit,
	};
};

export default useCorrectionRequest;
