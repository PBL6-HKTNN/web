import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  GenerateCertRes,
  GetMyCertsRes,
} from "@/types/db/course/certificate";
import { createApiService } from "@/utils";
import api from "@/utils/api";

// const api = createServiceApi(certificateApiUrl);

const _certificateService = {
  generateCert: async (enrollmentId: UUID): Promise<GenerateCertRes> => {
    const response = await api.post<GenerateCertRes>(
      API_ROUTES.CERTIFICATE.generateCert(enrollmentId)
    );
    return response.data;
  },
  getMyCerts: async (): Promise<GetMyCertsRes[]> => {
    const response = await api.get(API_ROUTES.CERTIFICATE.getMyCerts);
    return response.data;
  },
  getCertStatus: async (enrollmentId: UUID) => {
    const response = await api.get(
      API_ROUTES.CERTIFICATE.getCertStatus(enrollmentId)
    );
    return response.data;
  },
  downloadCert: async (enrollmentId: UUID) => {
    const response = await api.get(
      API_ROUTES.CERTIFICATE.downloadCert(enrollmentId)
    );
    return response.data;
  },
};

export const certificateService = createApiService(
  _certificateService,
  "CertificateService"
);
