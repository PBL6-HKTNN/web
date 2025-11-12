import type { Base, UUID } from "@/types/core";
import type { QuizQuestion } from "./quiz-question";
import type { QuizAttempt } from "./quiz-attempt";
import type { ApiResponse } from "@/types/core/api";

export type Quiz = Base & {
  title: string;
  description?: string;
  lessonId: UUID;
  totalMarks: number;
  passingMarks: number;
  questions?: QuizQuestion[];
};

export type CreateQuizReq = {
  lessonId: UUID;
  title: string;
  description: string;
  passingMarks: number;
  questions: QuizQuestion[];
};
export type UpdateQuizReq = CreateQuizReq;

export type CreateQuizRes = ApiResponse<Quiz>;
export type GetQuizRes = ApiResponse<Quiz>;
export type UpdateQuizRes = ApiResponse<Quiz>;
export type DeleteQuizRes = ApiResponse<string>;

// TODO: remove api default response since things got duplicated
export type QuizStartAttemptRes = ApiResponse<{
  quizAttempt: QuizAttempt;
  quiz: Quiz;
}>;

export type QuizSubmissionReq = {
  quizAttemptId: UUID;
  answers: {
    questionId: UUID;
    answerText: string;
    selectedAnswerIds: UUID[];
  }[];
};

export type QuizSubmissionRes = ApiResponse<QuizAttempt>;

//mock
export type QuizReq = {
  title: string;
  description?: string;
  totalMarks: number;
  passingScore: number;
  quizQuestions: QuizQuestion[];
};
