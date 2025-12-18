import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import type { ChangeAvatarReq, UpdateProfileReq, User } from "@/types/db";
import type { EditUserByAdminReq, CreateUserByAdminReq } from "@/types/db/user";
import type { ApiResponse } from "@/types/core/api";
import { toast } from "sonner";
import Persistence from "@/utils/persistence";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
};

export const useUsers = (params?: {
  Name?: string;
  Email?: string;
  Role?: string;
  Status?: string;
  EmailVerified?: boolean;
  SortBy?: string;
  PageSize?: number;
}) => {
  return useInfiniteQuery({
    queryKey: [...userQueryKeys.lists(), params],
    queryFn: ({ pageParam = 1 }) =>
      userService.getAllUsers({ ...params, Page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Stop when the current page has no data
      const hasData =
        lastPage.data &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length > 0;
      return hasData ? allPages.length + 1 : undefined;
    },
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useChangeAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{
      avatarUrl: string;
    }>,
    Error,
    { userId: string; data: ChangeAvatarReq }
  >({
    mutationFn: ({ userId, data }) => userService.changeAvatar(userId, data),
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        // Update user data in localStorage
        const currentUser = Persistence.getItem<User>("auth_user");
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            profilePicture: response.data.avatarUrl,
          };
          Persistence.setItem("auth_user", updatedUser);
        }

        // Invalidate auth queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["auth"] });

        toast.success("Avatar changed successfully");
      }
    },
    onError: (error) => {
      toast.error("Avatar change failed: " + error.message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<User>,
    Error,
    { userId: string; data: UpdateProfileReq }
  >({
    mutationFn: ({ userId, data }) => userService.updateProfile(userId, data),
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        // Update user data in localStorage
        const currentUser = Persistence.getItem<User>("auth_user");
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data };
          Persistence.setItem("auth_user", updatedUser);
        }

        // Invalidate auth queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["auth"] });

        toast.success("Profile updated successfully");
      }
    },
    onError: (error) => {
      toast.error("Profile update failed: " + error.message);
    },
  });
};

export const useEditUserByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<User>,
    Error,
    EditUserByAdminReq
  >({
    mutationFn: (data) => userService.editUserByAdmin(data),
    onSuccess: (response, variables) => {
      if (response.isSuccess && response.data) {
        // Invalidate user queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

        toast.success("User updated successfully");
      }
    },
    onError: (error) => {
      toast.error("Failed to update user: " + error.message);
    },
  });
};

export const useCreateUserByAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<User>,
    Error,
    CreateUserByAdminReq
  >({
    mutationFn: (data) => userService.createUserByAdmin(data),
    onSuccess: (response) => {
      if (response.isSuccess && response.data) {
        // Invalidate user queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });

        toast.success("User created successfully");
      }
    },
    onError: (error) => {
      toast.error("Failed to create user: " + error.message);
    },
  });
};

