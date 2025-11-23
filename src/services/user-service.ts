import API_ROUTES from "@/conf/constants/api-routes";
import type { ChangeAvatarReq, UpdateProfileReq } from "@/types/db";
import api from "@/utils/api";

export const userService = {
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
