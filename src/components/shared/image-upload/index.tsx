import React, { useRef } from "react";
import { Upload, Image, Video, FileText } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMediaUpload } from "./hooks";
import type { UploadFileRes } from "@/types/core/storage";

interface MediaUploadDialogProps {
  onMediaUploaded?: (result: UploadFileRes) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // in MB
  title?: string;
  description?: string;
}

const MediaUploadDialog: React.FC<MediaUploadDialogProps> = ({
  onMediaUploaded,
  onUploadError,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt",
  maxSize = 100, // 100MB default
  title = "Upload Media",
  description = "Select an image, video, or document file to upload.",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    previewUrl,
    handleFileSelect,
    isUploading,
    uploadError,
    handleUpload,
  } = useMediaUpload({
    onUploadSuccess: onMediaUploaded,
    onUploadError,
  });

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-8 w-8" />;
    if (file.type.startsWith("video/")) return <Video className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            data-testid="course-thumbnail-input"
          />

          {selectedFile ? (
            <div className="space-y-4">
              {/* File Preview */}
              {previewUrl ? (
                <div className="relative">
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                    />
                  ) : selectedFile.type.startsWith("video/") ? (
                    <video
                      src={previewUrl}
                      className="max-w-full max-h-48 mx-auto rounded-lg"
                      controls
                    />
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      {getFileIcon(selectedFile)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8">
                  {getFileIcon(selectedFile)}
                </div>
              )}

              {/* File Info */}
              <div className="text-sm text-gray-600">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p>{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Images, videos, or documents (max {maxSize}MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Progress value={100} className="w-full" />
            <p className="text-sm text-center text-gray-600">Uploading...</p>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Upload failed: {uploadError.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" disabled={isUploading}>
            Cancel
          </Button>
          <Button
            data-testid="upload-button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export { MediaUploadDialog };
export type { MediaUploadDialogProps };
