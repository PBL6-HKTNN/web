"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useCreateCourse,
  useUpdateCourse,
  useGetCourseById,
} from "@/hooks/queries/course/course-hooks";
import { useGetCategories } from "@/hooks/queries/course/category-hooks";
import type { UUID } from "@/types";
import type { Level } from "@/types/db/course";
import { courseFormSchema, type CourseFormData } from "./validator";
import { useToast } from "@/hooks/use-toast";

interface UseCourseFormProps {
  courseId?: UUID;
  instructorId: UUID;
  onSuccess?: (courseId: UUID) => void;
  onError?: (error: string) => void;
}

export function useCourseForm({
  courseId,
  instructorId,
  onSuccess,
  onError,
}: UseCourseFormProps) {
  const isEditMode = !!courseId;

  const { data: courseData, isLoading: isLoadingCourse } =
    useGetCourseById(courseId!);

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategories();

  const { error: errToast, success } = useToast();

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: "",
      categoryId: "",
      price: 0,
      level: 0 as Level,
      language: "",
    },
    values: courseData?.data
      ? {
          title: courseData.data.title,
          description: courseData.data.description || "",
          thumbnail: courseData.data.thumbnail || "",
          categoryId: courseData.data.categoryId,
          price: courseData.data.price,
          level: courseData.data.level,
          language: courseData.data.language,
        }
      : undefined,
  });

  const onValidSubmit = async (data: CourseFormData) => {
    try {
      if (isEditMode && courseId) {
        await updateCourseMutation.mutateAsync({
          courseId,
          data: {
            instructorId,
            categoryId: data.categoryId as UUID,
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail || null,
            price: data.price,
            level: data.level,
            language: data.language,
          },
        });
        success("Course updated successfully");
        onSuccess?.(courseId);
      } else {
        const result = await createCourseMutation.mutateAsync({
          instructorId,
          categoryId: data.categoryId as UUID,
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail || null,
          price: data.price,
          level: data.level,
          language: data.language,
        });
        success("Course created successfully");
        onSuccess?.(result.data?.id || "");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      errToast("Failed to save course: " + errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleSubmit = form.handleSubmit(onValidSubmit);

  return {
    form,
    handleSubmit,
    onValidSubmit,
    isLoading:
      createCourseMutation.isPending ||
      updateCourseMutation.isPending ||
      isLoadingCourse,
    categories: categoriesData?.data ?? [],
    isLoadingCategories,
    isPending:
      createCourseMutation.isPending || updateCourseMutation.isPending,
  };
}