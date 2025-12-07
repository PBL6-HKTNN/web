import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { responseFormSchema, type ResponseFormData } from "./validator";
import { useResolveRequest } from "@/hooks/queries/request-hooks";
import { RequestStatus } from "@/types/db/request";
import type { UUID } from "@/types";

export const useResponseForm = (requestId: UUID) => {
  const resolveRequest = useResolveRequest();

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      status: String(RequestStatus.Approved),
      response: "",
    },
  });

  const onSubmit = async (data: ResponseFormData) => {
    const status = parseInt(data.status) as RequestStatus;
    resolveRequest.mutate(
      {
        requestId,
        status,
        response: data.response,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return {
    form,
    onSubmit,
    isSubmitting: resolveRequest.isPending,
  };
};
