"use client";

import { useState } from "react";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import { useGetCourseContentById } from "@/hooks/queries/course/course-hooks";
import { useGetLessonsByModule } from "@/hooks/queries/course/module-hooks";

export function useContentTreeSidebar() {
  const {
    courseId,
    setSelectedModule,
    setSelectedLesson,
    openCreateModule,
    openCreateLesson,
    openDeleteModal,
    cloneModule,
    cloneLesson,
  } = useCourseEdit();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Fetch modules for this course
  const { data: modulesData, isLoading: isLoadingModules } = useGetCourseContentById(courseId);
  const modules = modulesData?.data?.module || [];

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setSelectedLesson(moduleId, lessonId);
  };

  const handleAddModule = () => {
    openCreateModule();
  };

  const handleAddLesson = (moduleId: string) => {
    openCreateLesson(moduleId);
  };

  const handleDeleteModule = (moduleId: string, moduleTitle: string) => {
    openDeleteModal('module', moduleId, moduleTitle);
  };

  const handleDeleteLesson = (lessonId: string, lessonTitle: string) => {
    openDeleteModal('lesson', lessonId, lessonTitle);
  };

  const handleCloneModule = async (moduleId: string) => {
    try {
      await cloneModule(moduleId);
    } catch (err) {
      // Error handling is done in the context
      console.error('Clone module failed:', err);
    }
  };

  const handleCloneLesson = async (lessonId: string) => {
    try {
      await cloneLesson(lessonId);
    } catch (err) {
      // Error handling is done in the context
      console.error('Clone lesson failed:', err);
    }
  };

  return {
    modules,
    expandedModules,
    isLoadingModules,
    toggleModuleExpansion,
    handleModuleSelect,
    handleLessonSelect,
    handleAddModule,
    handleAddLesson,
    handleDeleteModule,
    handleDeleteLesson,
    handleCloneModule,
    handleCloneLesson,
  };
}

export function useModuleLessons(moduleId: string) {
  const { data: lessonsData, isLoading } = useGetLessonsByModule(moduleId);
  return {
    lessons: lessonsData?.data || [],
    isLoading,
  };
}
