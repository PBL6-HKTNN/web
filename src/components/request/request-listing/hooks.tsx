import { useState } from "react";
import type { RequestTypeEnum } from "@/types/db/request";

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
