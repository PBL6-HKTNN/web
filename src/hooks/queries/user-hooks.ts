import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import type { ChangeAvatarReq, UpdateProfileReq, User } from "@/types/db";
import type { ApiResponse } from "@/types/core/api";
import { toast } from "sonner";
import Persistence from "@/utils/persistence";

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
