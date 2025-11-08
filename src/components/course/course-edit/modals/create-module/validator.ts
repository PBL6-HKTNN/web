import { z } from "zod";

export const createModuleFormSchema = z.object({
  title: z
    .string()
    .min(1, "Module title is required")
    .max(200, "Title must be less than 200 characters"),
  order: z
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),
});

export type CreateModuleFormData = z.infer<typeof createModuleFormSchema>;
