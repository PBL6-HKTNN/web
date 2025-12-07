import { z } from "zod";

export const courseReportSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type CourseReportFormData = z.infer<typeof courseReportSchema>;
