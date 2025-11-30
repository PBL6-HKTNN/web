import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateReview } from "@/hooks/queries/review-hooks";
import { reviewFormSchema, type ReviewFormData } from "./validator";
import type { UUID } from "@/types";

export const useReviewForm = (courseId: UUID, onSuccess?: () => void) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const createReviewMutation = useCreateReview();

  const onSubmit = (data: ReviewFormData) => {
    createReviewMutation.mutate({
      courseId,
      rating: data.rating,
      comment: data.comment,
    }, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: createReviewMutation.isPending,
  };
};
