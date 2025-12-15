import API_ROUTES from "@/conf/constants/api-routes";
import type { AxiosError } from "axios";
import type { UUID } from "@/types";
import type {
  EnrollResponse,
  GetEnrolledCoursesResponse,
  UpdateEnrollmentResponse,
  IsEnrolledResponse,
  UpdateEnrollmentReq,
  UpdateEnrollmentProgressReq,
  UpdateEnrollmentProgressResponse,
  GetEnrolledCourseCompletedLessonsResponse,
  UpdateCurrentViewResponse,
  UpdateCurrentViewReq,
  GetEnrolledCourseFilterReq,
  GetLastDateCourseResponse,
  GetCourseEnrolledStudentsResponse,
  AddToCalendarResponse,
} from "@/types/db/course/enrollment";
import { createServiceApi, serviceUrls, createApiService } from "@/utils/api";

const api = createServiceApi(serviceUrls.COURSE_SERVICE_URL);

const _enrollmentService = {
  isEnrolled: async (courseId: UUID): Promise<IsEnrolledResponse> => {
    try {
      const response = await api.post(
        API_ROUTES.ENROLLMENT.isEnrolled(courseId)
      );
      return response.data;
    } catch (e) {
      // Normalize error for hooks: if axios error then return the response data
      const err = (e as AxiosError)?.response?.data ?? e;
      throw err;
    }
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
    data: UpdateEnrollmentProgressReq
  ): Promise<UpdateEnrollmentProgressResponse> => {
    const response = await api.post(
      API_ROUTES.ENROLLMENT.updateEnrollmentProgress,
      data
    );
    return response.data;
  },

  getEnrolledCourses: async (
    filter?: GetEnrolledCourseFilterReq
  ): Promise<GetEnrolledCoursesResponse> => {
    const response = await api.get(API_ROUTES.ENROLLMENT.getEnrolledCourse, {
      params: filter,
    });
    return response.data;
  },

  getEnrolledCourseCompletedLessons: async (
    enrollmentId: UUID
  ): Promise<GetEnrolledCourseCompletedLessonsResponse> => {
    const response = await api.get(
      API_ROUTES.ENROLLMENT.getEnrolledCourseCompletedLessons(enrollmentId)
    );
    return response.data;
  },

  updateEnrollmentCurrentView: async (
    data: UpdateCurrentViewReq
  ): Promise<UpdateCurrentViewResponse> => {
    try {
      const response = await api.post(
        API_ROUTES.ENROLLMENT.updateEnrollmentCurrentView,
        data
      );
      return response.data;
    } catch (e) {
      const err = (e as AxiosError)?.response?.data ?? e;
      throw err;
    }
  },

  getLastDateCourse: async (
    courseId: UUID
  ): Promise<GetLastDateCourseResponse> => {
    const response = await api.get(
      API_ROUTES.ENROLLMENT.getLastDateCourse(courseId)
    );
    return response.data;
  },

  getCourseEnrolledStudents: async (
    courseId: UUID
  ): Promise<GetCourseEnrolledStudentsResponse> => {
    const response = await api.get(
      API_ROUTES.ENROLLMENT.getListStudentsByCourse(courseId)
    );
    return response.data;
  },

  getTotalEnrollmentsByCourse: async (courseId: UUID): Promise<number> => {
    const response = await api.get(
      API_ROUTES.ENROLLMENT.getTotalEnrollmentsByCourse(courseId)
    );
    return response.data.totalStudents;
  },

  addToCalendar: async (courseId: UUID): Promise<AddToCalendarResponse> => {
    const response = await api.get(API_ROUTES.ENROLLMENT.addCalendar(courseId));
    return response.data;
  },
};

// Export service with comprehensive error handling
export const enrollmentService = createApiService(
  _enrollmentService,
  "EnrollmentService"
);
