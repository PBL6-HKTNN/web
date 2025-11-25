import { z } from "zod";

export const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),

  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  thumbnail: z.string().url("Invalid URL format").optional().or(z.literal("")),

  categoryId: z.string().uuid("Invalid category"),

  price: z.number().min(0, "Price must be positive"),

  language: z.string().min(1, "Language is required"),

  level: z.union([z.literal(0), z.literal(1), z.literal(2)], {
    message: "Invalid level",
  }),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;