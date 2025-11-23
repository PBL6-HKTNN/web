import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type Review = Base & {
  courseId: UUID;
  userId: UUID;
  rating: number;
  comment: string;
};

export type CreateReviewRequest = {
  courseId: UUID;
  rating: number;
  comment: string;
};

export type CreateReviewResponse = ApiResponse<{
  message: string;
}>;
export type GetReviewsByCourseResponse = ApiResponse<Review[]>;
export type GetAverageRatingByCourseResponse = ApiResponse<{
  courseId: UUID;
  averageRating: number;
}>;
