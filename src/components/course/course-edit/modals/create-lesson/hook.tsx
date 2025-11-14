import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLesson as useCreateLessonAPI } from "@/hooks/queries/course/lesson-hooks";
import { useGetLessonsByModule } from "@/hooks/queries/course/module-hooks";
import { useCreateQuiz } from "@/hooks/queries/course/quiz-hooks";
import { useToast } from "@/hooks/use-toast";
import { createLessonFormSchema, type CreateLessonFormData } from "./validator";
import type { UUID } from "@/types";
import { LessonType } from "@/types/db/course/lesson";
import { useEffect } from "react";

interface UseCreateLessonHookProps {
  moduleId: UUID;
  onSuccess?: () => void;
}

export function useCreateLessonHook({ moduleId, onSuccess }: UseCreateLessonHookProps) {
  const { success, error } = useToast();
  const createLessonMutation = useCreateLessonAPI();
  const createQuizMutation = useCreateQuiz();
  const { data: lessonsData } = useGetLessonsByModule(moduleId);
  
  const existingLessonsCount = lessonsData?.data?.length || 0;
  
  const form = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonFormSchema),
    defaultValues: {
      title: "",
      duration: "10:00",
      orderIndex: existingLessonsCount + 1,
      isPreview: false,
      lessonType: 0 as LessonType, // Default to markdown
    },
  });
  
  // Update the orderIndex when lessons data changes
  useEffect(() => {
    form.setValue("orderIndex", existingLessonsCount + 1);
  }, [existingLessonsCount, form]);
  
  const handleSubmit = async (data: CreateLessonFormData) => {
    try {
      // Create the lesson first
      const lessonResponse = await createLessonMutation.mutateAsync({
        title: data.title,
        moduleId,
        contentUrl: data.lessonType === LessonType.MARKDOWN 
          ? "# " + data.title
          : data.lessonType === LessonType.VIDEO
            ? "sample-video-url.mp4"
            : "null",
        duration: data.duration,
        orderIndex: data.orderIndex,
        isPreview: data.isPreview,
        lessonType: data.lessonType,
      });
      
      // If it's a quiz lesson, create an empty quiz
      if (data.lessonType === 2 && lessonResponse.data?.id) {
        await createQuizMutation.mutateAsync({
          lessonId: lessonResponse.data.id,
          title: `${data.title} Quiz`,
          description: `Quiz for ${data.title}`,
          passingMarks: 70,
          questions: [], // Start with empty questions
        });
      }
      
      success(`Lesson "${data.title}" created successfully${data.lessonType === 2 ? ' with quiz' : ''}`);
      form.reset();
      onSuccess?.();
    } catch (err) {
      error(`Failed to create lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isLoading: createLessonMutation.isPending || createQuizMutation.isPending,
  };
}