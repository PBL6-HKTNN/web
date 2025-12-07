import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetRequestTypes, useCreateRequest } from "@/hooks/queries/request-hooks";
import { RequestTypeEnum } from "@/types/db/request";
import { courseReportSchema, type CourseReportFormData } from "./validator";
import type { UUID } from "@/types";

export const useCourseReportForm = (courseId: UUID) => {
  const [open, setOpen] = useState(false);
  const { data: requestTypesRes } = useGetRequestTypes();
  const createRequest = useCreateRequest();

  const form = useForm<CourseReportFormData>({
    resolver: zodResolver(courseReportSchema),
    defaultValues: {
      description: "",
    },
  });

  // Find the REPORT_A_COURSE request type
  const reportCourseType = requestTypesRes?.data?.find(
    (type) => type.type === RequestTypeEnum.REPORT_A_COURSE
  );

  const onSubmit = (data: CourseReportFormData) => {
    if (!reportCourseType) {
      console.error("Report course type not found");
      return;
    }

    createRequest.mutate(
      {
        requestTypeId: reportCourseType.id,
        description: data.description,
        courseId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  return {
    open,
    setOpen,
    form,
    onSubmit,
    isSubmitting: createRequest.isPending,
    reportCourseType,
  };
};
