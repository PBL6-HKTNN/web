import { automationApiUrl } from "@/conf";
import API_ROUTES from "@/conf/constants/api-routes";
import type {
  ContentGenerationReq,
  ContentGenerationRes,
  QuizGenerationReq,
  QuizGenerationRes,
} from "@/types/ai";
import { createServiceApi, createApiService } from "@/utils/api";

const api = createServiceApi(automationApiUrl);

const _automationService = {
  generateQuiz: async (data: QuizGenerationReq) => {
    const response = await api.post<Promise<QuizGenerationRes>>(
      API_ROUTES.AUTOMATION.generateQuiz,
      data
    );
    return response.data;
  },
  generateContent: async (data: ContentGenerationReq) => {
    const response = await api.post<Promise<ContentGenerationRes>>(
      API_ROUTES.AUTOMATION.generateContent,
      data
    );
    return response.data;
  },
};

// Export service with comprehensive error handling
export const automationService = createApiService(
  _automationService,
  "AutomationService"
);
