import { reviewApiUrl } from "@/conf";
import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsByCourseResponse,
  GetAverageRatingByCourseResponse,
  CheckUserReviewReq,
  CheckUserReviewRes,
  DeleteUserReviewReq,
  DeleteUserReviewRes,
  ReplyReviewReq,
  ReplyReviewRes,
} from "@/types/db/review";
import { createServiceApi, createApiService } from "@/utils/api";

const api = createServiceApi(reviewApiUrl);

const _reviewService = {
  createReview: async (
    payload: CreateReviewRequest
  ): Promise<CreateReviewResponse> => {
    const response = await api.post(API_ROUTES.REVIEW.createReview, payload);
    return response.data;
  },

  getReviewsByCourse: async (
    courseId: UUID
  ): Promise<GetReviewsByCourseResponse> => {
    const response = await api.get(
      API_ROUTES.REVIEW.getReviewsByCourse(courseId)
    );
    return response.data;
  },

  getAverageRatingByCourse: async (
    courseId: UUID
  ): Promise<GetAverageRatingByCourseResponse> => {
    const response = await api.get(
      API_ROUTES.REVIEW.getAverageRating(courseId)
    );
    return response.data;
  },

  checkUserReview: async (
    data: CheckUserReviewReq
  ): Promise<CheckUserReviewRes> => {
    const response = await api.post(API_ROUTES.REVIEW.checkUserReview, data);
    return response.data;
  },

  deleteUserReview: async (
    data: DeleteUserReviewReq
  ): Promise<DeleteUserReviewRes> => {
    const response = await api.delete(API_ROUTES.REVIEW.deleteUserReview, {
      data,
    });
    return response.data;
  },

  replyToReview: async (
    courseId: UUID,
    reviewId: UUID,
    data: ReplyReviewReq
  ): Promise<ReplyReviewRes> => {
    const response = await api.post(
      API_ROUTES.REVIEW.replyReview(courseId, reviewId),
      data
    );
    return response.data;
  },
};

// Export service with comprehensive error handling
export const reviewService = createApiService(_reviewService, "ReviewService");
