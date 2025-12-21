"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import type { Module } from "@/types/db/course/module";

const moduleFormSchema = z.object({
  courseId: z.uuid(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  order: z.number().min(1, "Order must be at least 1"),
});

type ModuleFormData = z.infer<typeof moduleFormSchema>;

export function useModuleRender(module: Module) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateModule, selectedModuleId, courseId } = useCourseEdit();

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: module.title,
      order: module.order,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({
      courseId: courseId,
      title: module.title,
      order: module.order,
    });
    setIsEditing(false);
  };

  const handleSave = (data: ModuleFormData) => {
    if (selectedModuleId) {
      updateModule(selectedModuleId, data);
      setIsEditing(false);
    }
  };

  return {
    isEditing,
    form,
    handleEdit,
    handleCancel,
    handleSave: form.handleSubmit(handleSave),
  };
}
