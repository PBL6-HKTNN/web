import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UUID } from "@/types";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
} from "@/types/db/review";
import { reviewService } from "@/services/review-service";

export const REVIEW_QUERY_KEYS = {
  all: ["review"] as const,
  byCourse: (courseId: UUID) =>
    [...REVIEW_QUERY_KEYS.all, "course", courseId] as const,
  average: (courseId: UUID) =>
    [...REVIEW_QUERY_KEYS.all, "average", courseId] as const,
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, Error, CreateReviewRequest>({
    mutationFn: (payload) => reviewService.createReview(payload),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        // invalidate cache for the course (reviews + average) using provided variables
        const courseId = variables.courseId;
        if (courseId) {
          queryClient.invalidateQueries({
            queryKey: REVIEW_QUERY_KEYS.byCourse(courseId),
          });
          queryClient.invalidateQueries({
            queryKey: REVIEW_QUERY_KEYS.average(courseId),
          });
        }
        toast.success("Review submitted");
      } else {
        toast.error("Failed to submit review");
      }
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });
};

export const useGetReviewsByCourse = (courseId: UUID | undefined) => {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.byCourse(courseId as UUID),
    queryFn: () => reviewService.getReviewsByCourse(courseId as UUID),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAverageRatingByCourse = (courseId: UUID | undefined) => {
  return useQuery({
    queryKey: REVIEW_QUERY_KEYS.average(courseId as UUID),
    queryFn: () => reviewService.getAverageRatingByCourse(courseId as UUID),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  });
};
