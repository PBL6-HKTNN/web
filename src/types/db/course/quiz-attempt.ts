import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type UserAnswer = Base & {
  attemptId: UUID;
  questionId: UUID;
  answerText: string | null;
  answerId: UUID;
};

export type QuizAttempt = Base & {
  userId: UUID;
  quizId: UUID;
  score: number;
  passed: boolean;
  status: number;
  attemptedAt: string;
  completedAt: string | null;
  userAnswers?: UserAnswer[];
};
export type GetQuizListResultsRes = ApiResponse<QuizAttempt[]>;
