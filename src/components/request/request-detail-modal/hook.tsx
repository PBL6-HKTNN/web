import { useState } from "react";
import { useGetRequestById } from "@/hooks/queries/request-hooks";
import type { UUID } from "@/types";

export const useRequestDetailModal = (requestId: UUID | null) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: requestRes, isLoading, error } = useGetRequestById(
    requestId || ("" as UUID)
  );

  const request = requestRes?.data;

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
    request,
    isLoading,
    error,
  };
};
