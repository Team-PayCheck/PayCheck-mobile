import { useState, useEffect } from "react";
import type { WorkplaceDetails } from "../../api/employer/types";
import { getWorkplaces } from "../../api/employer/index";

interface UseWorkplaceManagementReturn {
  workplaces: WorkplaceDetails[];
  isLoading: boolean;
  selectedWorkplaceId: number | null;
  setSelectedWorkplaceId: React.Dispatch<React.SetStateAction<number | null>>;
}

export function useWorkplaceManagement(): UseWorkplaceManagementReturn {
  const [workplaces, setWorkplaces] = useState<WorkplaceDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await getWorkplaces();
        const workplacesData = (response.data || []) as WorkplaceDetails[];
        setWorkplaces(workplacesData);
        if (workplacesData.length > 0) {
          const firstWorkplace = workplacesData[0];
          if (firstWorkplace) {
            setSelectedWorkplaceId(firstWorkplace.id);
          }
        }
      } catch {
        setWorkplaces([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkplaces();
  }, []);

  return {
    workplaces,
    isLoading,
    selectedWorkplaceId,
    setSelectedWorkplaceId,
  };
}
