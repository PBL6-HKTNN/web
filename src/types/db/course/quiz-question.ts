import type { Base } from "@/types/core";
import type { Answer } from "./answer";

export type QuizQuestion = Base & {
  questionText: string;
  type: QuestionType;
  marks: number;
  answers: Answer[];
};

export type QuizQuestionReq = Partial<QuizQuestion>;

export const QuestionType = {
  MULTIPLE_CHOICE: "multiple_choice",
  SINGLE_CHOICE: "single_choice",
  TRUE_FALSE: "true_false",
  SHORT_ANSWER: "short_answer",
} as const;

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
