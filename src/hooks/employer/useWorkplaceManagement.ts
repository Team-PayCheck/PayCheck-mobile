import { useState, useEffect } from "react";
import { Alert } from "react-native";
import type { WorkplaceDetails } from "../../api/employer/types";
import {
  getWorkplaces,
  createWorkplace,
  updateWorkplace,
  deleteWorkplace,
} from "../../api/employer/index";

interface UseWorkplaceManagementProps {
  onWorkplaceDeleted?: (workplaceId: number) => void;
  onWorkplaceChanged?: (workplaceId: number) => void;
}

interface UseWorkplaceManagementReturn {
  // 상태
  workplaces: WorkplaceDetails[];
  selectedWorkplaceId: number | null;
  isAddingWorkplace: boolean;
  isManagingWorkplaces: boolean;
  selectedWorkplaceForEdit: number | null;
  editingWorkplace: WorkplaceDetails | null;
  newWorkplaceName: string;
  newWorkplaceAddress: string;
  newWorkplaceBusinessNumber: string;
  newWorkplaceIsSmallBusiness: boolean;

  // Setters
  setWorkplaces: React.Dispatch<React.SetStateAction<WorkplaceDetails[]>>;
  setSelectedWorkplaceId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsAddingWorkplace: React.Dispatch<React.SetStateAction<boolean>>;
  setIsManagingWorkplaces: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedWorkplaceForEdit: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingWorkplace: React.Dispatch<React.SetStateAction<WorkplaceDetails | null>>;
  setNewWorkplaceName: React.Dispatch<React.SetStateAction<string>>;
  setNewWorkplaceAddress: React.Dispatch<React.SetStateAction<string>>;
  setNewWorkplaceBusinessNumber: React.Dispatch<React.SetStateAction<string>>;
  setNewWorkplaceIsSmallBusiness: React.Dispatch<React.SetStateAction<boolean>>;

  // 핸들러 함수
  handleManageWorkplaces: () => void;
  handleCancelManageWorkplaces: () => void;
  handleAddWorkplaceFromManage: () => void;
  handleAddWorkplace: () => Promise<void>;
  handleCancelAddWorkplace: () => void;
  handleDeleteWorkplace: () => void;
  handleEditWorkplace: (workplace: WorkplaceDetails) => void;
  handleSaveWorkplaceEdit: () => Promise<void>;
  handleCancelWorkplaceEdit: () => void;
  handleEditingWorkplaceChange: (data: {
    name?: string;
    address?: string;
    businessNumber?: string;
    isSmallBusiness?: boolean;
  }) => void;
}

export function useWorkplaceManagement({
  onWorkplaceDeleted,
  onWorkplaceChanged,
}: UseWorkplaceManagementProps = {}): UseWorkplaceManagementReturn {
  const [workplaces, setWorkplaces] = useState<WorkplaceDetails[]>([]);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number | null>(null);
  const [isAddingWorkplace, setIsAddingWorkplace] = useState(false);
  const [newWorkplaceName, setNewWorkplaceName] = useState("");
  const [newWorkplaceAddress, setNewWorkplaceAddress] = useState("");
  const [newWorkplaceBusinessNumber, setNewWorkplaceBusinessNumber] = useState("");
  const [newWorkplaceIsSmallBusiness, setNewWorkplaceIsSmallBusiness] = useState(false);
  const [isManagingWorkplaces, setIsManagingWorkplaces] = useState(false);
  const [selectedWorkplaceForEdit, setSelectedWorkplaceForEdit] = useState<number | null>(null);
  const [editingWorkplace, setEditingWorkplace] = useState<WorkplaceDetails | null>(null);

  // 근무지 목록 조회
  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await getWorkplaces();
        const workplacesData = (response.data || []) as WorkplaceDetails[];
        setWorkplaces(workplacesData);
        if (workplacesData.length > 0 && !selectedWorkplaceId) {
          const firstWorkplace = workplacesData[0];
          if (firstWorkplace) {
            setSelectedWorkplaceId(firstWorkplace.id);
          }
        }
      } catch (error) {
        setWorkplaces([]);
      }
    };
    fetchWorkplaces();
  }, []);

  const handleManageWorkplaces = () => {
    setIsManagingWorkplaces(true);
    setIsAddingWorkplace(false);
    setSelectedWorkplaceForEdit(null);
    setEditingWorkplace(null);
  };

  const handleCancelManageWorkplaces = () => {
    setIsManagingWorkplaces(false);
    setSelectedWorkplaceForEdit(null);
    setEditingWorkplace(null);
  };

  const handleAddWorkplaceFromManage = () => {
    setIsManagingWorkplaces(false);
    setIsAddingWorkplace(true);
    setSelectedWorkplaceForEdit(null);
    setEditingWorkplace(null);
    setNewWorkplaceName("");
    setNewWorkplaceAddress("");
    setNewWorkplaceBusinessNumber("");
    setNewWorkplaceIsSmallBusiness(false);
  };

  const handleAddWorkplace = async () => {
    const workplaceName = newWorkplaceName.trim();

    if (!workplaceName) {
      Alert.alert("입력 오류", "근무지 이름을 입력해주세요.");
      return;
    }

    if (workplaces.some((wp) => wp.name === workplaceName)) {
      Alert.alert("입력 오류", "이미 존재하는 근무지입니다.");
      return;
    }

    try {
      const response = await createWorkplace({
        businessName: workplaceName,
        workplaceName,
        address: newWorkplaceAddress.trim(),
        businessNumber: newWorkplaceBusinessNumber.trim(),
        isLessThanFiveEmployees: newWorkplaceIsSmallBusiness,
      });
      const createdWorkplace = response.data as WorkplaceDetails;

      setWorkplaces((prev) => [...prev, createdWorkplace]);
      setSelectedWorkplaceId(createdWorkplace.id);
      setIsAddingWorkplace(false);
      setNewWorkplaceName("");
      setNewWorkplaceAddress("");
      setNewWorkplaceBusinessNumber("");
      setNewWorkplaceIsSmallBusiness(false);

      onWorkplaceChanged?.(createdWorkplace.id);
    } catch (error) {
      const err = error as { message?: string };
      Alert.alert("추가 실패", err.message || "근무지 추가 중 오류가 발생했습니다.");
    }
  };

  const handleCancelAddWorkplace = () => {
    setIsAddingWorkplace(false);
    setNewWorkplaceName("");
    setNewWorkplaceAddress("");
    setNewWorkplaceBusinessNumber("");
    setNewWorkplaceIsSmallBusiness(false);
  };

  const handleDeleteWorkplace = () => {
    if (!selectedWorkplaceId) return;

    const workplaceToDelete = workplaces.find((wp) => wp.id === selectedWorkplaceId);
    if (!workplaceToDelete) return;

    Alert.alert(
      "근무지 삭제",
      `${workplaceToDelete.name}을(를) 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            const updatedWorkplaces = workplaces.filter((wp) => wp.id !== selectedWorkplaceId);
            if (updatedWorkplaces.length === 0) {
              Alert.alert("오류", "최소 하나의 근무지는 필요합니다.");
              return;
            }
            try {
              await deleteWorkplace(selectedWorkplaceId);
              setWorkplaces(updatedWorkplaces);
              const firstWorkplace = updatedWorkplaces[0];
              if (firstWorkplace) setSelectedWorkplaceId(firstWorkplace.id);
              onWorkplaceDeleted?.(selectedWorkplaceId);
            } catch (error) {
              const err = error as { message?: string };
              Alert.alert("삭제 실패", err.message || "근무지 삭제 중 오류가 발생했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleEditWorkplace = (workplace: WorkplaceDetails) => {
    setEditingWorkplace({
      id: workplace.id,
      businessName: workplace.businessName || workplace.name || "",
      name: workplace.name || "",
      address: workplace.address || "",
      businessNumber: workplace.businessNumber || "",
      isSmallBusiness: workplace.isSmallBusiness || false,
    });
    setSelectedWorkplaceForEdit(workplace.id);
  };

  const handleSaveWorkplaceEdit = async () => {
    if (!editingWorkplace) return;

    if (!editingWorkplace.name.trim()) {
      Alert.alert("입력 오류", "근무지 이름을 입력해주세요.");
      return;
    }

    const isDuplicate = workplaces.some(
      (wp) => wp.name === editingWorkplace.name.trim() && wp.id !== editingWorkplace.id
    );
    if (isDuplicate) {
      Alert.alert("입력 오류", "이미 존재하는 근무지입니다.");
      return;
    }

    try {
      await updateWorkplace(editingWorkplace.id, {
        businessName: editingWorkplace.name.trim(),
        workplaceName: editingWorkplace.name.trim(),
        address: editingWorkplace.address?.trim() ?? "",
        isLessThanFiveEmployees: !!editingWorkplace.isSmallBusiness,
      });

      setWorkplaces((prev) =>
        prev.map((wp) =>
          wp.id === editingWorkplace.id
            ? {
                ...wp,
                name: editingWorkplace.name.trim(),
                address: editingWorkplace.address?.trim() ?? "",
                businessNumber: editingWorkplace.businessNumber?.trim() ?? "",
                isSmallBusiness: !!editingWorkplace.isSmallBusiness,
              }
            : wp
        )
      );

      setEditingWorkplace(null);
      setSelectedWorkplaceForEdit(null);
      onWorkplaceChanged?.(editingWorkplace.id);
    } catch (error) {
      const err = error as { message?: string };
      Alert.alert("수정 실패", err.message || "근무지 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancelWorkplaceEdit = () => {
    setEditingWorkplace(null);
    setSelectedWorkplaceForEdit(null);
  };

  const handleEditingWorkplaceChange = (data: {
    name?: string;
    address?: string;
    businessNumber?: string;
    isSmallBusiness?: boolean;
  }) => {
    setEditingWorkplace((prev) => (prev ? { ...prev, ...data } : prev));
  };

  return {
    workplaces,
    selectedWorkplaceId,
    isAddingWorkplace,
    isManagingWorkplaces,
    selectedWorkplaceForEdit,
    editingWorkplace,
    newWorkplaceName,
    newWorkplaceAddress,
    newWorkplaceBusinessNumber,
    newWorkplaceIsSmallBusiness,

    setWorkplaces,
    setSelectedWorkplaceId,
    setIsAddingWorkplace,
    setIsManagingWorkplaces,
    setSelectedWorkplaceForEdit,
    setEditingWorkplace,
    setNewWorkplaceName,
    setNewWorkplaceAddress,
    setNewWorkplaceBusinessNumber,
    setNewWorkplaceIsSmallBusiness,

    handleManageWorkplaces,
    handleCancelManageWorkplaces,
    handleAddWorkplaceFromManage,
    handleAddWorkplace,
    handleCancelAddWorkplace,
    handleDeleteWorkplace,
    handleEditWorkplace,
    handleSaveWorkplaceEdit,
    handleCancelWorkplaceEdit,
    handleEditingWorkplaceChange,
  };
}
