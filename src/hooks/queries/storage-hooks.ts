import { useMutation } from "@tanstack/react-query";
import { storageService } from "@/services/storage-service";
import type { UploadFileReq, UploadFileRes } from "@/types/core/storage";

export const useUploadFile = () => {
  return useMutation<UploadFileRes, Error, UploadFileReq>({
    mutationFn: storageService.uploadFile,
  });
};

export const useDeleteFile = () => {
  return useMutation<void, Error, string>({
    mutationFn: storageService.deleteFile,
  });
};
