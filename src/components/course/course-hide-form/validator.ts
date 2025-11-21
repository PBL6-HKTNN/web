import { z } from "zod";

export const courseHideSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters long")
      .max(500, "Reason must not exceed 500 characters"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type CourseHideFormData = z.infer<typeof courseHideSchema>;
