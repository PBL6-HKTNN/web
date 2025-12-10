import API_ROUTES from "@/conf/constants/api-routes";
import type { ChangeAvatarReq, UpdateProfileReq } from "@/types/db";
import api, { createApiService } from "@/utils/api";
import type { User, UserDetailResponse } from "@/types/db/user";
import type { ApiResponse } from "@/types/core/api";

const _userService = {
  getAllUsers: async (params?: {
    Name?: string;
    Email?: string;
    Role?: string;
    Status?: string;
    EmailVerified?: boolean;
    SortBy?: string;
    Page?: number;
    PageSize?: number;
  }): Promise<ApiResponse<User[]>> => {
    const response = await api.get(API_ROUTES.USER.getAllUsers, { params });
    return response.data;
  },

  getUserById: async (userId: string): Promise<UserDetailResponse> => {
    const response = await api.get(API_ROUTES.USER.getById(userId));
    return response.data;
  },

  changeAvatar: async (userId: string, data: ChangeAvatarReq) => {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await api.postForm(
      API_ROUTES.USER.changeAvatar(userId),
      formData
    );
    return response.data;
  },

  updateProfile: async (userId: string, data: UpdateProfileReq) => {
    const response = await api.put(API_ROUTES.USER.updateProfile(userId), data);
    return response.data;
  },
};

// Export service with comprehensive error handling
export const userService = createApiService(_userService, "UserService");
