import { useState } from "react";

export function useCourseEditing() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Mock loading state for future API integration - can be toggled for testing

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    isLoading,
    setIsLoading,
  };
}
