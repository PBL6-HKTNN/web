import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type Review = Base & {
  courseId: UUID;
  userId: UUID;
  name: string;
  rating: number;
  comment: string;
  reply?: string;
  replyAt?: string | Date;
  replyBy?: UUID;
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

export type CheckUserReviewReq = {
  courseId: UUID;
  reviewId: UUID;
};

export type CheckUserReviewRes = ApiResponse<Review>;

export type DeleteUserReviewReq = CheckUserReviewReq;
export type DeleteUserReviewRes = ApiResponse<null>;

export type ReplyReviewReq = {
  reply: string;
};

export type ReplyReviewRes = ApiResponse<Review>;
