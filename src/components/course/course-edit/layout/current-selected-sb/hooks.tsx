"use client";

import { useState } from "react";
import { useCourseEdit } from "@/contexts/course/course-edit";

export function useCurrentSelectedSidebar() {
  const {
    selectedModuleId,
    selectedLessonId,
    deleteModule,
    deleteLesson,
    setSelectedModule,
    setSelectedLesson,
    setSelectMode,
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

    setDeleteModal({
      isOpen: true,
      type: 'module',
      title: 'Delete Module',
      description: 'Are you sure you want to delete this module? This action cannot be undone and will also delete all lessons within this module.',
    });
  };

  const handleDeleteLesson = () => {
    if (!selectedModuleId || !selectedLessonId) return;

    setDeleteModal({
      isOpen: true,
      type: 'lesson',
      title: 'Delete Lesson',
      description: 'Are you sure you want to delete this lesson? This action cannot be undone.',
    });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'module' && selectedModuleId) {
      deleteModule(selectedModuleId);
      setSelectedModule(null);
      setSelectMode(null);
    } else if (deleteModal.type === 'lesson' && selectedModuleId && selectedLessonId) {
      deleteLesson(selectedModuleId, selectedLessonId);
      setSelectedLesson(null);
      setSelectMode('module');
    }

    setDeleteModal({
      isOpen: false,
      type: null,
      title: '',
      description: '',
    });
  };

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
    confirmDelete,
    closeDeleteModal,
  };
}