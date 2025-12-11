import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  CreateModuleReq,
  CreateModuleRes,
  DeleteModuleRes,
  GetLessonsByModuleRes,
  GetModuleRes,
  GetModulesRes,
  UpdateModuleReq,
  UpdateModuleRes,
} from "@/types/db/course/module";
import { createServiceApi, serviceUrls, createApiService } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

const _moduleService = {
  getModules: async (): Promise<GetModulesRes> => {
    const response = await api.get<GetModulesRes>(API_ROUTES.MODULE.getModules);
    return response.data;
  },
  createModule: async (
    moduleData: CreateModuleReq
  ): Promise<CreateModuleRes> => {
    const response = await api.post<CreateModuleRes>(
      API_ROUTES.MODULE.createModule,
      moduleData
    );
    return response.data;
  },
  getLessonsByModule: async (
    moduleId: UUID
  ): Promise<GetLessonsByModuleRes> => {
    const response = await api.get<GetLessonsByModuleRes>(
      API_ROUTES.MODULE.getLessonsByModule(moduleId)
    );
    return response.data;
  },
  getModuleById: async (moduleId: UUID): Promise<GetModuleRes> => {
    const response = await api.get<GetModuleRes>(
      API_ROUTES.MODULE.getModuleById(moduleId)
    );
    return response.data;
  },
  updateModule: async (
    moduleId: UUID,
    moduleData: UpdateModuleReq
  ): Promise<UpdateModuleRes> => {
    const response = await api.post<UpdateModuleRes>(
      API_ROUTES.MODULE.updateModule(moduleId),
      moduleData
    );
    return response.data;
  },
  deleteModule: async (moduleId: UUID): Promise<DeleteModuleRes> => {
    const response = await api.delete<DeleteModuleRes>(
      API_ROUTES.MODULE.deleteModule(moduleId)
    );
    return response.data;
  },
};

// Export service with comprehensive error handling
export const moduleService = createApiService(_moduleService, "ModuleService");
