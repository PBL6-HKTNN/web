import { z } from "zod";

export const responseFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
  response: z
    .string()
    .min(1, "Response message is required")
    .max(500, "Response must be less than 500 characters"),
});

export type ResponseFormData = z.infer<typeof responseFormSchema>;
