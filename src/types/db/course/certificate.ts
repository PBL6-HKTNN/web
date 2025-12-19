import type { Base } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";
import type { UUID } from "crypto";

export type Certificate = Omit<Base, "id"> & {
  certificateId: UUID;
  certificateUrl: string;
  publicId: string;
  completionDate?: string | Date | null;
  expiryDate: string | Date | null;
};

export type GenerateCertRes = ApiResponse<
  Certificate & {
    success: boolean;
    message: string;
  }
>;

export type GetMyCertsRes = ApiResponse<{
  success: boolean;
  message: string;
  certificates: Certificate[];
}>;

export type CertStatusRes = ApiResponse<{
  success: string;
  message: string;
  certificateUrl: string;
  expiryDate: string;
  certificateId: string;
  status: string;
}>;

export type DownloadCertRes = ApiResponse<{
  success: boolean;
  message: string;
  certificateId: UUID;
  downloadUrl: string;
}>;
