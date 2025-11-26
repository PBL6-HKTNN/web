import { createContext } from "react";
import type { UUID } from "@/types";

export interface CourseProgressContextType {
  // Markdown progress tracking
  trackMarkdownScroll: (element: HTMLElement) => void;
  markMarkdownComplete: (courseId: UUID, lessonId: UUID) => void;

  // Video progress tracking
  trackVideoProgress: (
    currentTime: number,
    duration: number,
    courseId: UUID,
    lessonId: UUID
  ) => void;

  // Quiz progress tracking
  markQuizComplete: (courseId: UUID, lessonId: UUID, passed: boolean) => void;

  // Generic progress tracking
  markLessonComplete: (courseId: UUID, lessonId: UUID) => void;
  
  // Current view tracking
  updateCurrentView: (courseId: UUID, currentLessonId: UUID) => void;
  
  // Completion status checking
  isLessonCompleted: (lessonId: UUID) => boolean;
  getCompletedLessons: () => UUID[];
}

export const CourseProgressContext = createContext<
  CourseProgressContextType | undefined
>(undefined);
