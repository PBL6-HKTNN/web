import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateQuizInVideo } from "@/hooks/queries/course/quiz-hooks";
import { useToast } from "@/hooks/use-toast";
import {
  createQuizInVideoSchema,
  type CreateQuizInVideoFormData,
} from "./validator";
import type { UUID } from "@/types/core";

interface UseCreateQuizInVideoModalProps {
  lessonId: UUID;
  onSuccess?: () => void;
}

export function useCreateQuizInVideoModal({
  lessonId,
  onSuccess,
}: UseCreateQuizInVideoModalProps) {
  const { success, error } = useToast();
  const [optionsList, setOptionsList] = useState<string[]>(["", ""]);
  const createQuizMutation = useCreateQuizInVideo();

  const form = useForm<CreateQuizInVideoFormData>({
    resolver: zodResolver(createQuizInVideoSchema),
    defaultValues: {
      time: "",
      question: "",
      options: ["", ""],
      correctAnswer: "",
    },
  });

  const handleAddOption = () => {
    if (optionsList.length < 6) {
      setOptionsList([...optionsList, ""]);
      form.setValue("options", [...optionsList, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (optionsList.length > 2) {
      const newOptions = optionsList.filter((_, i) => i !== index);
      setOptionsList(newOptions);
      form.setValue("options", newOptions);
      // Reset correct answer if it was pointing to removed option
      if (form.getValues("correctAnswer") === optionsList[index]) {
        form.setValue("correctAnswer", "");
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...optionsList];
    newOptions[index] = value;
    setOptionsList(newOptions);
    form.setValue("options", newOptions);
  };

  const onSubmit = async (data: CreateQuizInVideoFormData) => {
    try {
      await createQuizMutation.mutateAsync({
        lessonId,
        time: data.time,
        question: data.question,
        options: data.options.filter((opt) => opt.trim() !== ""),
        correctAnswer: data.correctAnswer,
      });

      success("Quiz created successfully");
      form.reset({
        time: "",
        question: "",
        options: ["", ""],
        correctAnswer: "",
      });
      setOptionsList(["", ""]);
      onSuccess?.();
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to create quiz");
    }
  };

  return {
    form,
    optionsList,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    onSubmit,
    isLoading: createQuizMutation.isPending,
  };
}
