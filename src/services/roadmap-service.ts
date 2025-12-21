import API_ROUTES from "@/conf/constants/api-routes";
import { createServiceApi, serviceUrls, createApiService } from "@/utils/api";
import type {
  CreateRoadmapReq,
  UpdateRoadmapReq,
  AddCourseToRoadmapReq,
  ReorderRoadmapCoursesReq,
  GetMyRoadmapsResponse,
  GetRoadmapDetailResponse,
  CreateRoadmapResponse,
  UpdateRoadmapResponse,
  JoinRoadmapResponse,
  AddCourseToRoadmapResponse,
  RemoveCourseFromRoadmapResponse,
  ReorderRoadmapCoursesResponse,
  SyncRoadmapProgressResponse,
  DeleteRoadmapResponse,
} from "@/types/db/roadmap";
import type { UUID } from "@/types";

const api = createServiceApi(serviceUrls.ENROLLMENT_SERVICE_URL);

const _roadmapService = {
  create: async (
    data: CreateRoadmapReq
  ): Promise<CreateRoadmapResponse> => {
    const response = await api.post(API_ROUTES.ROADMAP.create, data);
    return response.data;
  },

  getMy: async (): Promise<GetMyRoadmapsResponse> => {
    const response = await api.get(API_ROUTES.ROADMAP.getMy);
    return response.data;
  },

  getDetail: async (id: UUID): Promise<GetRoadmapDetailResponse> => {
    const response = await api.get(API_ROUTES.ROADMAP.getDetail(id));
    return response.data;
  },

  join: async (id: UUID): Promise<JoinRoadmapResponse> => {
    const response = await api.post(API_ROUTES.ROADMAP.join(id));
    return response.data;
  },

  update: async (
    id: UUID,
    data: UpdateRoadmapReq
  ): Promise<UpdateRoadmapResponse> => {
    const response = await api.put(API_ROUTES.ROADMAP.update(id), data);
    return response.data;
  },

  addCourse: async (
    id: UUID,
    data: AddCourseToRoadmapReq
  ): Promise<AddCourseToRoadmapResponse> => {
    const response = await api.post(API_ROUTES.ROADMAP.addCourse(id), data);
    return response.data;
  },

  reorderCourses: async (
    id: UUID,
    data: ReorderRoadmapCoursesReq
  ): Promise<ReorderRoadmapCoursesResponse> => {
    const response = await api.put(API_ROUTES.ROADMAP.reorderCourses(id), data);
    return response.data;
  },

  removeCourse: async (
    id: UUID,
    courseId: UUID
  ): Promise<RemoveCourseFromRoadmapResponse> => {
    const response = await api.delete(
      API_ROUTES.ROADMAP.removeCourse(id, courseId)
    );
    return response.data;
  },

  syncProgress: async (
    id: UUID
  ): Promise<SyncRoadmapProgressResponse> => {
    const response = await api.post(API_ROUTES.ROADMAP.syncProgress(id));
    return response.data;
  },

  delete: async (id: UUID): Promise<DeleteRoadmapResponse> => {
    const response = await api.delete(API_ROUTES.ROADMAP.delete(id));
    return response.data;
  },
};

// Export service with comprehensive error handling
const roadmapService = createApiService(_roadmapService, "RoadmapService");

export default roadmapService;

