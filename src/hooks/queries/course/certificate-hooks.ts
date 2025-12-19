import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { certificateService } from "@/services/course/certificate-service";
import type { UUID } from "@/types";
import type {
  GenerateCertRes,
  CertStatusRes,
  DownloadCertRes,
} from "@/types/db/course/certificate";

export const certificateQueryKeys = {
  allCertificates: ["certificates"] as const,
  myCertificates: () =>
    [...certificateQueryKeys.allCertificates, "mine"] as const,
  certStatus: (enrollmentId?: UUID) =>
    [...certificateQueryKeys.allCertificates, "status", enrollmentId] as const,
  certDownload: (enrollmentId?: UUID) =>
    [
      ...certificateQueryKeys.allCertificates,
      "download",
      enrollmentId,
    ] as const,
  certGenerate: (enrollmentId?: UUID) =>
    [
      ...certificateQueryKeys.allCertificates,
      "generate",
      enrollmentId,
    ] as const,
};

/**
 * Fetch current user's certificates
 */
export const useGetMyCertificates = () => {
  return useQuery({
    queryKey: certificateQueryKeys.myCertificates(),
    queryFn: () => certificateService.getMyCerts(),
    retry: 1,
  });
};

/**
 * Generate a certificate for an enrollment
 */
export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation<GenerateCertRes, unknown, UUID>({
    mutationFn: (enrollmentId: UUID) =>
      certificateService.generateCert(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.myCertificates(),
      });
      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.allCertificates,
      });
    },
  });
};

/**
 * Get certificate status for a given enrollment
 */
export const useGetCertStatus = (enrollmentId?: UUID) => {
  return useQuery<CertStatusRes>({
    queryKey: certificateQueryKeys.certStatus(enrollmentId),
    queryFn: () => certificateService.getCertStatus(enrollmentId || ""),
    enabled: !!enrollmentId,
    retry: false,
  });
};

/**
 * Download certificate for an enrollment (returns a download URL)
 */
export const useDownloadCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation<DownloadCertRes, unknown, UUID>({
    mutationFn: (enrollmentId: UUID) =>
      certificateService.downloadCert(enrollmentId),
    onSuccess: () => {
      // Invalidate user certificates to reflect any changes
      queryClient.invalidateQueries({
        queryKey: certificateQueryKeys.myCertificates(),
      });
    },
  });
};
