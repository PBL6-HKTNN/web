"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const courseGeneralInfoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  thumbnail: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

export type CourseGeneralInfoFormData = z.infer<typeof courseGeneralInfoSchema>;

interface UseCourseGeneralInfoFormProps {
  initialData?: {
    title?: string;
    description?: string;
    thumbnail?: string | null;
  };
  onSubmit: (data: CourseGeneralInfoFormData) => void;
}

export function useCourseGeneralInfoForm({ initialData, onSubmit }: UseCourseGeneralInfoFormProps) {
  const form = useForm<CourseGeneralInfoFormData>({
    resolver: zodResolver(courseGeneralInfoSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      thumbnail: initialData?.thumbnail || "",
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    handleSubmit,
  };
}
