import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  EnrollResponse,
  GetEnrolledCoursesResponse,
  UpdateEnrollmentResponse,
  IsEnrolledResponse,
  UpdateEnrollmentReq,
  updateEnrollmentProgressReq,
  UpdateEnrollmentProgressResponse,
} from "@/types/db/course/enrollment";
import { createServiceApi, serviceUrls } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

export const enrollmentService = {
  isEnrolled: async (courseId: UUID): Promise<IsEnrolledResponse> => {
    const response = await api.post(API_ROUTES.ENROLLMENT.isEnrolled(courseId));
    return response.data;
  },

  enroll: async (courseId: UUID): Promise<EnrollResponse> => {
    const response = await api.post(API_ROUTES.ENROLLMENT.enroll(courseId));
    return response.data;
  },

  updateEnrollment: async (
    data: UpdateEnrollmentReq
  ): Promise<UpdateEnrollmentResponse> => {
    const response = await api.post(
      API_ROUTES.ENROLLMENT.updateEnrollment,
      data
    );
    return response.data;
  },

  updateEnrollmentProgress: async (
    data: updateEnrollmentProgressReq
  ): Promise<UpdateEnrollmentProgressResponse> => {
    const response = await api.post(
      API_ROUTES.ENROLLMENT.updateEnrollmentProgress,
      data
    );
    return response.data;
  },

  getEnrolledCourses: async (): Promise<GetEnrolledCoursesResponse> => {
    const response = await api.get(API_ROUTES.ENROLLMENT.getEnrolledCourse);
    return response.data;
  },
};
