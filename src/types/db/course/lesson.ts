import type { Base } from "@/types/core";
import type { Quiz, QuizReq } from "./quiz";

const LessonType = {
  VIDEO: "video",
  MARKDOWN: "markdown",
  QUIZ: "quiz",
} as const;

export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export type Lesson = Base & {
  title: string;
  rawContent: string;
  contentUrl: string;
  duration: number;
  orderIndex: number;
  isPreviewable: boolean;
  lessonType: LessonType;
  quiz: Quiz | null;
};

export type LessonReq = {
  id?: string;
  title: string;
  rawContent: string;
  contentUrl: string;
  duration: number;
  orderIndex: number;
  isPreviewable: boolean;
  lessonType: LessonType | null;
  quiz: QuizReq | null;
};
