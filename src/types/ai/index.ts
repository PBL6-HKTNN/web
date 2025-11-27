import type { ApiResponse } from "../core/api";
import type { QuizQuestion } from "../db/course/quiz-question";

export type QuizGenerationReq = {
  user_request: string;
  quantity: number;
};

export type ContentGenerationReq = Omit<QuizGenerationReq, "quantity">;

export type QuizGenerationRes = ApiResponse<{
  questions: QuizQuestion[];
}>;

export type ContentGenerationRes = ApiResponse<{
  content: string;
}>;
