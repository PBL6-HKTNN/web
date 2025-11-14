import type { Answer } from "./answer";
import type { UUID } from "@/types/core";

export type QuizQuestion = {
  questionId?: UUID;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  answers: Answer[];
};

export const QuestionType = {
  SINGLE_CHOICE: 0,
  MULTIPLE_CHOICE: 1,
  TRUE_FALSE: 2,
  SHORT_ANSWER: 3,
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
