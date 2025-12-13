import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UUID } from "@/types";
import type {
  CreateRequestReq,
  UpdateRequestReq,
  ResolveRequestReq,
} from "@/types/db/request";
import { requestService } from "@/services/request-service";

// Query Keys
export const REQUEST_QUERY_KEYS = {
  all: ["request"] as const,
  requests: () => [...REQUEST_QUERY_KEYS.all, "requests"] as const,
  userRequests: () => [...REQUEST_QUERY_KEYS.all, "user-requests"] as const,
  resolvedRequests: () =>
    [...REQUEST_QUERY_KEYS.all, "resolved-requests"] as const,
  requestTypes: () => [...REQUEST_QUERY_KEYS.all, "types"] as const,
  request: (id: UUID) => [...REQUEST_QUERY_KEYS.all, "request", id] as const,
};

// Query Hooks
export const useGetRequests = () => {
  return useQuery({
    queryKey: REQUEST_QUERY_KEYS.requests(),
    queryFn: () => requestService.getRequests(),
  });
};

export const useGetUserRequests = () => {
  return useQuery({
    queryKey: REQUEST_QUERY_KEYS.userRequests(),
    queryFn: () => requestService.getUserRequests(),
  });
};

export const useGetResolvedRequests = () => {
  return useQuery({
    queryKey: REQUEST_QUERY_KEYS.resolvedRequests(),
    queryFn: () => requestService.getResolvedRequests(),
  });
};

export const useGetRequestTypes = () => {
  return useQuery({
    queryKey: REQUEST_QUERY_KEYS.requestTypes(),
    queryFn: () => requestService.getRequestTypes(),
  });
};

export const useGetRequestById = (requestId: UUID) => {
  return useQuery({
    queryKey: REQUEST_QUERY_KEYS.request(requestId),
    queryFn: () => requestService.getRequestById(requestId),
    enabled: !!requestId,
  });
};

// Mutation Hooks
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestReq) => requestService.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.userRequests(),
      });
      toast.success("Request created successfully");
    },
    onError: () => {
      toast.error("Failed to create request");
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: UUID;
      data: UpdateRequestReq;
    }) => requestService.updateRequest(requestId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.userRequests(),
      });
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.request(data.data?.id as string),
      });
      toast.success("Request updated successfully");
    },
    onError: () => {
      toast.error("Failed to update request");
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: UUID) => requestService.deleteRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.userRequests(),
      });
      toast.success("Request deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete request");
    },
  });
};

export const useResolveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResolveRequestReq) =>
      requestService.resolveRequest(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.requests(),
      });
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.resolvedRequests(),
      });
      queryClient.invalidateQueries({
        queryKey: REQUEST_QUERY_KEYS.request(data.data?.id as string),
      });
      toast.success("Request resolved successfully");
    },
    onError: () => {
      toast.error("Failed to resolve request");
    },
  });
};

// Utility hook for request operations
export const useRequestOperations = () => {
  const createRequest = useCreateRequest();
  const updateRequest = useUpdateRequest();
  const deleteRequest = useDeleteRequest();
  const resolveRequest = useResolveRequest();

  return {
    createRequest: createRequest.mutate,
    updateRequest: updateRequest.mutate,
    deleteRequest: deleteRequest.mutate,
    resolveRequest: resolveRequest.mutate,
    isCreating: createRequest.isPending,
    isUpdating: updateRequest.isPending,
    isDeleting: deleteRequest.isPending,
    isResolving: resolveRequest.isPending,
  };
};
