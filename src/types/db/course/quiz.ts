import type { Base } from "@/types/core";
import type { QuizQuestion, QuizQuestionReq } from "./quiz-question";

export type Quiz = Base & {
  title: string;
  description?: string;
  totalMarks: number;
  passingScore: number;
  quizQuestions: QuizQuestion[];
};

export type QuizReq = {
  title: string;
  description?: string;
  totalMarks: number;
  passingScore: number;
  quizQuestions: QuizQuestionReq[];
};
