/**
 * Types for Cloudinary file upload requests and responses.
 */

import type { ApiResponse } from "./api";

export const FileTypesValues = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  OTHER: "other",
} as const;

export type FileType = (typeof FileTypesValues)[keyof typeof FileTypesValues];

export type UploadFileReq = {
  type: FileType;
  file: File;
};

export type UploadFileRes = ApiResponse<{
  url: string;
  publicId: string;
  type: FileType;
}>;
