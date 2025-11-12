"use client";

import { useCourseEdit } from "@/contexts/course/use-course-edit";

export function useContentRender() {
  const { selectMode, getSelectedModule, getSelectedLesson } = useCourseEdit();

  const selectedModule = getSelectedModule();
  const selectedLesson = getSelectedLesson();

  return {
    selectMode,
    selectedModule,
    selectedLesson,
  };
}
