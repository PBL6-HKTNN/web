"use client";

import { createContext, useState } from "react";
import type { ReactNode } from "react";
import { 
  useGetModuleById,
  useDeleteModule,
  useCreateModule,
  useUpdateModule
} from "@/hooks/queries/course/module-hooks";
import { 
  useGetLessonById, 
  useDeleteLesson,
  useCreateLesson,
  useUpdateLesson
} from "@/hooks/queries/course/lesson-hooks";
import {
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz
} from "@/hooks/queries/course/quiz-hooks";
import { useToast } from "@/hooks/use-toast";
import type { UUID } from "@/types";
import type { Module } from "@/types/db/course/module";
import type { Lesson } from "@/types/db/course/lesson";

import type { CreateQuizReq, UpdateQuizReq } from "@/types/db/course/quiz";
import type { CreateModuleReq, UpdateModuleReq } from "@/types/db/course/module";
import type { CreateLessonReq, UpdateLessonReq } from "@/types/db/course/lesson";

// Context state types
interface CourseEditContextType {
  // Course data
  courseId: UUID;
  
  // Selection state
  selectedModuleId: UUID | null;
  selectedLessonId: UUID | null;
  selectMode: 'module' | 'lesson' | null;
  
  // Modal states
  isCreateModuleOpen: boolean;
  isCreateLessonOpen: boolean;
  isDeleteModalOpen: boolean;
  createLessonModuleId: UUID | null;
  
  // Delete target
  deleteTarget: {
    type: 'module' | 'lesson';
    id: UUID;
    title: string;
  } | null;
  
  // Actions
  setSelectedModule: (moduleId: UUID | null) => void;
  setSelectedLesson: (moduleId:UUID , lessonId: UUID | null) => void;
  setSelectMode: (mode: 'module' | 'lesson' | null) => void;
  
  // Modal actions
  openCreateModule: () => void;
  closeCreateModule: () => void;
  openCreateLesson: (moduleId: UUID) => void;
  closeCreateLesson: () => void;
  openDeleteModal: (type: 'module' | 'lesson', id: UUID, title: string) => void;
  closeDeleteModal: () => void;
  confirmDelete: () => void;
  
  // Module actions
  createModule: (moduleData: CreateModuleReq) => Promise<void>;
  updateModule: (moduleId: UUID, moduleData: UpdateModuleReq) => Promise<void>;
  
  // Lesson actions
  createLesson: (lessonData: CreateLessonReq) => Promise<void>;
  updateLesson: (lessonId: UUID, lessonData: UpdateLessonReq) => Promise<void>;
  
  // Quiz actions
  createQuiz: (lessonId: UUID, quizData: CreateQuizReq) => Promise<void>;
  updateQuiz: (quizId: UUID, quizData: UpdateQuizReq) => Promise<void>;
  deleteQuiz: (quizId: UUID) => Promise<void>;
  
  // Data getters
  getSelectedModule: () => Module | null;
  getSelectedLesson: () => Lesson | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CourseEditContext = createContext<CourseEditContextType | undefined>(undefined);

interface CourseEditProviderProps {
  children: ReactNode;
  courseId: UUID;
}

export function CourseEditProvider({ children, courseId }: CourseEditProviderProps) {
  const { success, error } = useToast();
  
  // Selection state
  const [selectedModuleId, setSelectedModuleId] = useState<UUID | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<UUID | null>(null);
  const [selectMode, setSelectMode] = useState<'module' | 'lesson' | null>(null);
  
  // Modal states
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [createLessonModuleId, setCreateLessonModuleId] = useState<UUID | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'module' | 'lesson';
    id: UUID;
    title: string;
  } | null>(null);
  
  // Data hooks
  const selectedModule = useGetModuleById(selectedModuleId!);
  const selectedLesson = useGetLessonById(selectedLessonId!);
  
  // Module mutations
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();
  const deleteModuleMutation = useDeleteModule();
  
  // Lesson mutations
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();
  const deleteLessonMutation = useDeleteLesson();
  
  // Quiz mutations
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();
  
  // Actions
  const handleSetSelectedModule = (moduleId: UUID | null) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(null);
    setSelectMode(moduleId ? 'module' : null);
  };
  
  const handleSetSelectedLesson = (moduleId: UUID, lessonId: UUID | null) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lessonId);
    setSelectMode(lessonId ? 'lesson' : null);
  };
  
  // Modal actions
  const openCreateModule = () => setIsCreateModuleOpen(true);
  const closeCreateModule = () => setIsCreateModuleOpen(false);
  
  const openCreateLesson = (moduleId: UUID) => {
    setCreateLessonModuleId(moduleId);
    setIsCreateLessonOpen(true);
  };
  const closeCreateLesson = () => {
    setCreateLessonModuleId(null);
    setIsCreateLessonOpen(false);
  };
  
  const openDeleteModal = (type: 'module' | 'lesson', id: UUID, title: string) => {
    setDeleteTarget({ type, id, title });
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeleteModalOpen(false);
  };
  
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      if (deleteTarget.type === 'module') {
        await deleteModuleMutation.mutateAsync(deleteTarget.id);
        success(`Module "${deleteTarget.title}" deleted successfully`);
        if (selectedModuleId === deleteTarget.id) {
          setSelectedModuleId(null);
          setSelectMode(null);
        }
      } else if (deleteTarget.type === 'lesson') {
        await deleteLessonMutation.mutateAsync(deleteTarget.id);
        success(`Lesson "${deleteTarget.title}" deleted successfully`);
        if (selectedLessonId === deleteTarget.id) {
          setSelectedLessonId(null);
          setSelectMode(selectedModuleId ? 'module' : null);
        }
      }
      closeDeleteModal();
    } catch (err) {
      error(`Failed to delete ${deleteTarget.type}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Module actions
  const handleCreateModule = async (moduleData: CreateModuleReq) => {
    try {
      await createModuleMutation.mutateAsync(moduleData);
      success('Module created successfully');
    } catch (err) {
      error(`Failed to create module: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const handleUpdateModule = async (moduleId: UUID, moduleData: UpdateModuleReq) => {
    try {
      await updateModuleMutation.mutateAsync({ moduleId, data: moduleData });
      success('Module updated successfully');
    } catch (err) {
      error(`Failed to update module: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Lesson actions
  const handleCreateLesson = async (lessonData: CreateLessonReq) => {
    try {
      await createLessonMutation.mutateAsync(lessonData);
      success('Lesson created successfully');
    } catch (err) {
      error(`Failed to create lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const handleUpdateLesson = async (lessonId: UUID, lessonData: UpdateLessonReq) => {
    try {
      await updateLessonMutation.mutateAsync({ lessonId, data: lessonData });
      success('Lesson updated successfully');
    } catch (err) {
      error(`Failed to update lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Quiz actions
  const handleCreateQuiz = async (lessonId: UUID, quizData: CreateQuizReq) => {
    try {
      // Ensure lessonId is included in quiz data
      const quizDataWithLesson = { ...quizData, lessonId };
      await createQuizMutation.mutateAsync(quizDataWithLesson);
      success('Quiz created successfully');
    } catch (err) {
      error(`Failed to create quiz: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const handleUpdateQuiz = async (quizId: UUID, quizData: UpdateQuizReq) => {
    try {
      await updateQuizMutation.mutateAsync({ quizId, data: quizData });
      success('Quiz updated successfully');
    } catch (err) {
      error(`Failed to update quiz: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const handleDeleteQuiz = async (quizId: UUID) => {
    try {
      await deleteQuizMutation.mutateAsync(quizId);
      success('Quiz deleted successfully');
    } catch (err) {
      error(`Failed to delete quiz: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };


  
  // Data getters
  const getSelectedModule = () => selectedModule.data?.data || null;
  const getSelectedLesson = () => selectedLesson.data?.data || null;
  
  const contextValue: CourseEditContextType = {
    courseId,
    selectedModuleId,
    selectedLessonId,
    selectMode,
    isCreateModuleOpen,
    isCreateLessonOpen,
    createLessonModuleId,
    isDeleteModalOpen,
    deleteTarget,
    setSelectedModule: handleSetSelectedModule,
    setSelectedLesson: handleSetSelectedLesson,
    setSelectMode,
    openCreateModule,
    closeCreateModule,
    openCreateLesson,
    closeCreateLesson,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    createModule: handleCreateModule,
    updateModule: handleUpdateModule,
    createLesson: handleCreateLesson,
    updateLesson: handleUpdateLesson,
    createQuiz: handleCreateQuiz,
    updateQuiz: handleUpdateQuiz,
    deleteQuiz: handleDeleteQuiz,
    getSelectedModule,
    getSelectedLesson,
  };
  
  return (
    <CourseEditContext.Provider value={contextValue}>
      {children}
    </CourseEditContext.Provider>
  );
}

