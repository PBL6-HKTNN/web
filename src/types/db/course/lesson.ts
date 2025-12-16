import type { Base, UUID } from "@/types/core";
import type { Quiz } from "./quiz";
import type { ApiResponse } from "@/types/core/api";
import type { QuizInVideo } from "./quiz-question";

export const LessonType = {
  MARKDOWN: 0,
  VIDEO: 1,
  QUIZ: 2,
} as const;

export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export type Lesson = Base & {
  title: string;
  moduleId: UUID;
  contentUrl: string;
  duration: number | string;
  orderIndex: number;
  isPreview: boolean;
  lessonType: LessonType;
  quiz?: Quiz | null;
};

export type CreateLessonReq = Omit<Lesson, keyof Base | "quiz">;
export type UpdateLessonReq = CreateLessonReq;

export type CreateLessonRes = ApiResponse<Lesson>;
export type GetLessonRes = ApiResponse<Lesson>;
export type UpdateLessonRes = ApiResponse<Lesson>;
export type DeleteLessonRes = ApiResponse<string>;

export type CheckLessonLockedRes = ApiResponse<Lesson>;

export type CheckLessonVideoRes = ApiResponse<
  Omit<QuizInVideo, keyof Base> & {
    id: UUID;
  }
>;
