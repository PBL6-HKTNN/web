import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateModule as useCreateModuleAPI } from "@/hooks/queries/course/module-hooks";
import { useGetModulesByCourse } from "@/hooks/queries/course/course-hooks";
import { useToast } from "@/hooks/use-toast";
import { createModuleFormSchema, type CreateModuleFormData } from "./validator";
import type { UUID } from "@/types";
import { useEffect } from "react";

interface UseCreateModuleHookProps {
  courseId: UUID;
  onSuccess?: () => void;
}

export function useCreateModuleHook({ courseId, onSuccess }: UseCreateModuleHookProps) {
  const { success, error } = useToast();
  const createModuleMutation = useCreateModuleAPI();
  const { data: modulesData } = useGetModulesByCourse(courseId);
  
  const existingModulesCount = modulesData?.data?.length || 0;
  
  const form = useForm<CreateModuleFormData>({
    resolver: zodResolver(createModuleFormSchema),
    defaultValues: {
      title: "",
      order: existingModulesCount + 1,
    },
  });
  
  // Update the order when modules data changes
  useEffect(() => {
    form.setValue("order", existingModulesCount + 1);
  }, [existingModulesCount, form]);
  
  const handleSubmit = async (data: CreateModuleFormData) => {
    try {
      await createModuleMutation.mutateAsync({
        title: data.title,
        order: data.order,
        courseId,
      });
      
      success(`Module "${data.title}" created successfully`);
      form.reset();
      onSuccess?.();
    } catch (err) {
      error(`Failed to create module: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isLoading: createModuleMutation.isPending,
  };
}