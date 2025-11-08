import { useState, useCallback } from "react";
import { useUploadFile } from "@/hooks/queries/storage-hooks";
import type { FileType, UploadFileRes } from "@/types/core/storage";
import { useToast } from "@/hooks/use-toast";

interface UseMediaUploadProps {
  onUploadSuccess?: (result: UploadFileRes) => void;
  onUploadError?: (error: Error) => void;
}

export function useMediaUpload({
  onUploadSuccess,
  onUploadError,
}: UseMediaUploadProps = {}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { error } = useToast();
  const uploadFileMutation = useUploadFile();

  const getFileType = useCallback((file: File): FileType => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    )
      return "document";
    return "other";
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);

    // Create preview for images and videos
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      const fileType = getFileType(selectedFile);
      const result = await uploadFileMutation.mutateAsync({
        type: fileType,
        file: selectedFile,
      });

      onUploadSuccess?.(result);

      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      error('File upload failed: ' + err);
      onUploadError?.(err as Error);
    }
  }, [selectedFile, getFileType, uploadFileMutation, onUploadSuccess, onUploadError, error]);

  const reset = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }, [previewUrl]);

  return {
    // File state
    selectedFile,
    previewUrl,
    handleFileSelect,

    // Upload state
    isUploading: uploadFileMutation.isPending,
    uploadError: uploadFileMutation.error,
    handleUpload,

    // Utilities
    reset,
    getFileType,
  };
}
