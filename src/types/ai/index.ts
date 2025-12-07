import type { ApiResponse } from "../core/api";
import type { QuizQuestion } from "../db/course/quiz-question";

export interface AttachedContextItem {
  title: string;
  content: string;
}

export type QuizGenerationReq = {
  user_request: string;
  quantity: number;
  attached_context?: AttachedContextItem[];
};

export type ContentGenerationReq = Omit<QuizGenerationReq, "quantity">;

export type QuizGenerationRes = ApiResponse<{
  questions: QuizQuestion[];
}>;

export type ContentGenerationRes = ApiResponse<{
  content: string;
}>;
