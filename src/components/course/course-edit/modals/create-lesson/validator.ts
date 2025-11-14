import { z } from "zod";

export const createLessonFormSchema = z.object({
  title: z
    .string()
    .min(1, "Lesson title is required")
    .max(200, "Title must be less than 200 characters"),
  duration: z.string().min(1, "Duration is required"),
  orderIndex: z
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),
  isPreview: z.boolean(),
  lessonType: z
    .union([z.literal(0), z.literal(1), z.literal(2)])
    .refine((val) => [0, 1, 2].includes(val), {
      message: "Please select a valid lesson type",
    }),
});

export type CreateLessonFormData = z.infer<typeof createLessonFormSchema>;
