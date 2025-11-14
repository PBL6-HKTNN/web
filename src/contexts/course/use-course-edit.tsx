import { useContext } from "react";
import { CourseEditContext } from "./course-edit";

export function useCourseEdit() {
  const context = useContext(CourseEditContext);
  if (context === undefined) {
    throw new Error('useCourseEdit must be used within a CourseEditProvider');
  }
  return context;
}