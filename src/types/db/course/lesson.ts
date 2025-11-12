import type { Base, UUID } from "@/types/core";
import type { Quiz, QuizReq } from "./quiz";
import type { ApiResponse } from "@/types/core/api";

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
  duration: string;
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

//mock
export type LessonReq = {
  id?: string;
  title: string;
  rawContent: string;
  contentUrl: string;
  duration: number;
  orderIndex: number;
  isPreview: boolean;
  lessonType: LessonType | null;
  quiz?: QuizReq | null;
};
