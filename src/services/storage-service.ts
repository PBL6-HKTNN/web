import { storageApiUrl } from "@/conf";
import API_ROUTES from "@/conf/constants/api-routes";
import type { UploadFileReq, UploadFileRes } from "@/types/core/storage";
import { createServiceApi } from "@/utils";

const api = createServiceApi(storageApiUrl);

export const storageService = {
  uploadFile: async (req: UploadFileReq): Promise<UploadFileRes> => {
    const formData = new FormData();
    formData.append("file", req.file);
    const response = await api.postForm(
      API_ROUTES.STORAGE.uploadFile(req.type),
      formData
    );
    return response.data;
  },

  deleteFile: async (publicId: string) => {
    const response = await api.delete(API_ROUTES.STORAGE.deleteFile(publicId));
    return response.data;
  },
};
