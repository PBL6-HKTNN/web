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
} from "@/types/db/course";
import { createServiceApi, serviceUrls } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

export const courseService = {
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
};
