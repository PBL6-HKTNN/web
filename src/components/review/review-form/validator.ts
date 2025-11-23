import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must not exceed 1000 characters"),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
