import { z } from "zod";
import { QuestionType } from "@/types/db/course/quiz-question";

// Answer schema
export const answerSchema = z.object({
  answerId: z.string().optional(),
  answerText: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

// Question schema with conditional validation
export const questionSchema = z
  .object({
    questionId: z.string().optional(),
    questionText: z.string().min(1, "Question text is required"),
    questionType: z.number(),
    marks: z.number().min(1, "Marks must be at least 1"),
    answers: z.array(answerSchema),
  })
  .superRefine((data, ctx) => {
    // Single choice validation
    if (data.questionType === QuestionType.SINGLE_CHOICE) {
      if (data.answers.length > 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Single choice questions can have maximum 4 answers",
          path: ["answers"],
        });
      }
      const correctCount = data.answers.filter((a) => a.isCorrect).length;
      if (correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Single choice questions must have exactly 1 correct answer",
          path: ["answers"],
        });
      }
    }

    // Multiple choice validation
    if (data.questionType === QuestionType.MULTIPLE_CHOICE) {
      if (data.answers.length > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Multiple choice questions can have maximum 5 answers",
          path: ["answers"],
        });
      }
      const correctCount = data.answers.filter((a) => a.isCorrect).length;
      if (correctCount < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Multiple choice questions must have at least 2 correct answers",
          path: ["answers"],
        });
      }
    }

    // True/False validation
    if (data.questionType === QuestionType.TRUE_FALSE) {
      if (data.answers.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "True/False questions must have exactly 2 answers",
          path: ["answers"],
        });
      }
      const correctCount = data.answers.filter((a) => a.isCorrect).length;
      if (correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "True/False questions must have exactly 1 correct answer",
          path: ["answers"],
        });
      }
    }

    // Short answer validation
    if (data.questionType === QuestionType.SHORT_ANSWER) {
      if (data.answers.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Short answer questions must have at least 1 expected answer",
          path: ["answers"],
        });
      }
      // All short answer answers should be marked as correct
      const allCorrect = data.answers.every((a) => a.isCorrect);
      if (!allCorrect) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "All short answer expected answers must be marked as correct",
          path: ["answers"],
        });
      }
    }
  });

// Quiz form schema
export const quizFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  passingMarks: z.number().min(0, "Passing marks must be at least 0"),
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

export type QuizFormData = z.infer<typeof quizFormSchema>;
