import { z } from "zod";

/**
 * Validator for time format (mm:ss)
 */
const timeFormatValidator = z
  .string()
  .min(1, "Time is required")
  .regex(/^(\d{1,2}):(\d{2})$/, 'Time must be in "mm:ss" format')
  .refine((time) => {
    const [minutes, seconds] = time.split(":").map(Number);
    return seconds < 60 && minutes >= 0;
  }, "Invalid time format");

/**
 * Validator for create quiz in video form
 */
export const createQuizInVideoSchema = z.object({
  time: timeFormatValidator,
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed"),
  correctAnswer: z.string().min(1, "Please select a correct answer"),
});

export type CreateQuizInVideoFormData = z.infer<typeof createQuizInVideoSchema>;
