import { useState, useCallback, useMemo } from "react";
import type { CodemyRequest, RequestTypeEnum } from "@/types/db/request";
import type { RequestType } from "@/types/db/request";

export const useRequestFilters = () => {
  const [selectedType, setSelectedType] = useState<RequestTypeEnum | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedStatus("all");
  };

  const hasFilters = selectedType !== "all" || selectedStatus !== "all";

  return {
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    clearFilters,
    hasFilters,
  };
};

export const useRequestTypeFilter = (requestTypes: RequestType[]) => {
  const applyFixedFilter = useCallback(
    (reqs: CodemyRequest[], fixedRequestTypeFilter?: RequestTypeEnum | RequestTypeEnum[]): CodemyRequest[] => {
      if (!fixedRequestTypeFilter) return reqs;
      
      const enums = Array.isArray(fixedRequestTypeFilter) ? fixedRequestTypeFilter : [fixedRequestTypeFilter];
      const typeIds = requestTypes
        .filter((type) => enums.includes(type.type as RequestTypeEnum))
        .map((type) => type.id);
      
      return reqs.filter((req) => typeIds.includes(req.requestTypeId));
    },
    [requestTypes]
  );

  return { applyFixedFilter };
};

export const useRequestListingFilters = (
  requests: CodemyRequest[],
  selectedTypeId: string | "all",
  selectedStatus: number | "all",
  applyFixedFilter: (reqs: CodemyRequest[]) => CodemyRequest[]
) => {
  const filteredRequests = useMemo(() => {
    const result = applyFixedFilter(requests);

    return result.filter((request) => {
      const typeMatch =
        selectedTypeId === "all" || request.requestTypeId === selectedTypeId;
      const statusMatch =
        selectedStatus === "all" || request.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [requests, selectedTypeId, selectedStatus, applyFixedFilter]);

  return filteredRequests;
};

export const useRequestDetailModal = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequestId(null);
  };

  return {
    selectedRequestId,
    isDetailModalOpen,
    handleViewRequest,
    handleCloseModal,
  };
};
