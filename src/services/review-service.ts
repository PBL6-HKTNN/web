import { reviewApiUrl } from "@/conf";
import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  GetReviewsByCourseResponse,
  GetAverageRatingByCourseResponse,
} from "@/types/db/review";
import { createServiceApi } from "@/utils";

const api = createServiceApi(reviewApiUrl);

export const reviewService = {
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
};
