import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  CreateCourseReq,
  CreateCourseRes,
  DeleteCourseRes,
  GetCourseContentRes,
  GetCourseModulesRes,
  GetCourseRes,
  GetCoursesFilterReq,
  GetCoursesRes,
  UpdateCourseReq,
  UpdateCourseRes,
  ValidateCourseReq,
  ValidateCourseRes,
  ChangeCourseStatusReq,
  ChangeCourseStatusRes,
  ModChangeCourseStatusReq,
  ModChangeCourseStatusRes,
  PreSubmitCheckReq,
  PreSubmitCheckRes,
  RequestedBanCourseRes,
  CourseAnalyticsRes,
} from "@/types/db/course";
import { createServiceApi, serviceUrls, createApiService } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

const _courseService = {
  getCourses: async (filters: GetCoursesFilterReq): Promise<GetCoursesRes> => {
    const res = await api.get<GetCoursesRes>(API_ROUTES.COURSE.getCourses, {
      params: filters,
    });
    return res.data;
  },
  getCourseById: async (id: UUID): Promise<GetCourseRes> => {
    const res = await api.get<GetCourseRes>(
      API_ROUTES.COURSE.getCourseById(id)
    );
    return res.data;
  },
  getCourseContentById: async (id: UUID): Promise<GetCourseContentRes> => {
    const res = await api.get<GetCourseContentRes>(
      API_ROUTES.COURSE.getCourseContentById(id)
    );
    return res.data;
  },
  getModulesByCourse: async (courseId: UUID): Promise<GetCourseModulesRes> => {
    const res = await api.get<GetCourseModulesRes>(
      API_ROUTES.COURSE.getModulesByCourse(courseId)
    );
    return res.data;
  },
  createCourse: async (
    courseData: CreateCourseReq
  ): Promise<CreateCourseRes> => {
    const res = await api.post<CreateCourseRes>(
      API_ROUTES.COURSE.createCourse,
      courseData
    );
    return res.data;
  },
  updateCourse: async (
    courseId: UUID,
    courseData: UpdateCourseReq
  ): Promise<UpdateCourseRes> => {
    const res = await api.post<UpdateCourseRes>(
      API_ROUTES.COURSE.updateCourse(courseId),
      courseData
    );
    return res.data;
  },
  deleteCourse: async (courseId: UUID): Promise<DeleteCourseRes> => {
    const res = await api.delete<DeleteCourseRes>(
      API_ROUTES.COURSE.deleteCourse(courseId)
    );
    return res.data;
  },
  validateCourse: async (
    validationData: ValidateCourseReq
  ): Promise<ValidateCourseRes> => {
    const res = await api.post<ValidateCourseRes>(
      API_ROUTES.COURSE.validateCourse,
      validationData
    );
    return res.data;
  },
  changeCourseStatus: async (
    data: ChangeCourseStatusReq
  ): Promise<ChangeCourseStatusRes> => {
    const res = await api.put<ChangeCourseStatusRes>(
      API_ROUTES.COURSE.changeCourseStatus,
      data
    );
    return res.data;
  },
  modChangeCourseStatus: async (
    data: ModChangeCourseStatusReq
  ): Promise<ModChangeCourseStatusRes> => {
    const res = await api.put<ModChangeCourseStatusRes>(
      API_ROUTES.COURSE.modChangeCourseStatus,
      data
    );
    return res.data;
  },
  requestedBanCourse: async (
    courseId: UUID
  ): Promise<RequestedBanCourseRes> => {
    const res = await api.post<RequestedBanCourseRes>(
      API_ROUTES.COURSE.requestedBanCourse(courseId)
    );
    return res.data;
  },
  preSubmitCheck: async (
    data: PreSubmitCheckReq
  ): Promise<PreSubmitCheckRes> => {
    const res = await api.post<PreSubmitCheckRes>(
      API_ROUTES.COURSE.preSubmitCheck,
      data
    );
    return res.data;
  },
  analytics: async (): Promise<CourseAnalyticsRes> => {
    const res = await api.get<CourseAnalyticsRes>(API_ROUTES.COURSE.analytics);
    return res.data;
  },
};

// Export service with comprehensive error handling
export const courseService = createApiService(_courseService, "CourseService");
