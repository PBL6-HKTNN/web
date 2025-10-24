"use client";

import { useState, useEffect } from "react";
import { useCourseEdit } from "@/contexts/course/course-edit";
import type { LessonReq } from "@/types/db/course/lesson";

export function useLessonRender(lesson: LessonReq) {
  const { selectedModuleId, selectedLessonId, updateLesson } = useCourseEdit();
  const [selectedLessonType, setSelectedLessonType] = useState<LessonReq["lessonType"] | null>(
    lesson.lessonType || null
  );

  // Reset lesson type when lesson changes
  useEffect(() => {
    setSelectedLessonType(lesson.lessonType || null);
  }, [lesson.id, lesson.lessonType]);

  const handleSelectLessonType = (type: LessonReq["lessonType"]) => {
    setSelectedLessonType(type);
    if (selectedModuleId && selectedLessonId) {
      updateLesson(selectedModuleId, selectedLessonId, { lessonType: type });
    }
  };

  const handleUpdateContent = (content: string) => {
    if (selectedModuleId && selectedLessonId) {
      updateLesson(selectedModuleId, selectedLessonId, { rawContent: content });
    }
  };

  const handleUpdateContentUrl = (url: string) => {
    if (selectedModuleId && selectedLessonId) {
      updateLesson(selectedModuleId, selectedLessonId, { contentUrl: url });
    }
  };

  return {
    selectedLessonType,
    handleSelectLessonType,
    handleUpdateContent,
    handleUpdateContentUrl,
  };
}
