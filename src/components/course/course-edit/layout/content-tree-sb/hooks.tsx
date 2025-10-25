"use client";

import { useState } from "react";
import { useCourseEdit } from "@/contexts/course/course-edit";

export function useContentTreeSidebar() {
  const {
    form,
    addModule,
    addLesson,
    setSelectedModule,
    setSelectedLesson,
  } = useCourseEdit();

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const modules = form.watch("modules");

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
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleAddModule = () => {
    const newModule = {
      title: `Module ${modules.length + 1}`,
      order: modules.length + 1,
      lessons: [],
    };
    addModule(newModule);
  };

  const handleAddLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newLesson = {
      title: `Lesson ${module.lessons.length + 1}`,
      rawContent: `# ${`Lesson ${module.lessons.length + 1}`}\n\nStart writing your lesson content here...`,
      contentUrl: "",
      duration: 900,
      orderIndex: module.lessons.length + 1,
      isPreviewable: false,
      lessonType: null,
      quiz: null,
    };
    addLesson(moduleId, newLesson);
  };

  return {
    modules,
    expandedModules,
    toggleModuleExpansion,
    handleModuleSelect,
    handleLessonSelect,
    handleAddModule,
    handleAddLesson,
  };
}
