"use client";

import { useState } from "react";
import { useCourseEdit } from "@/contexts/course/use-course-edit";

export function useCurrentSelectedSidebar() {
  const {
    selectedModuleId,
    selectedLessonId,
    openDeleteModal,
  } = useCourseEdit();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'module' | 'lesson' | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    description: '',
  });

  const handleDeleteModule = () => {
    if (!selectedModuleId) return;
    
    // Use the context's openDeleteModal function
    openDeleteModal('module', selectedModuleId, 'Selected Module');
  };

  const handleDeleteLesson = () => {
    if (!selectedModuleId || !selectedLessonId) return;
    
    // Use the context's openDeleteModal function
    openDeleteModal('lesson', selectedLessonId, 'Selected Lesson');
  };

  // Remove the confirmDelete function as it's now handled by the context

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      title: '',
      description: '',
    });
  };

  return {
    deleteModal,
    handleDeleteModule,
    handleDeleteLesson,
    closeDeleteModal,
  };
}