import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export const EnrollmentStatus = {
  ACTIVE: 0,
  COMPLETED: 1,
  CANCELLED: 2,
} as const;

export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const EnrollmentProgressStatus = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
} as const;
export type EnrollmentProgressStatus =
  (typeof EnrollmentProgressStatus)[keyof typeof EnrollmentProgressStatus];

export type Enrollment = Base & {
  studentId: UUID;
  courseId: UUID;
  progressStatus: EnrollmentProgressStatus;
  currentView: UUID | null;
  watchedSeconds: number | null;
  lessonId: UUID | null;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string | Date;
  completionDate: string | Date | null;
  certificateUrl: string | null;
  certificateExpiryDate: string | Date | null;
};

export type CreateEnrollmentReq = {
  studentId: UUID;
  courseId: UUID;
};

export type UpdateEnrollmentReq = {
  progressStatus?: EnrollmentProgressStatus;
  lessonId?: UUID | null;
  enrollmentStatus?: EnrollmentStatus;
  completionDate?: string | Date | null;
  certificateUrl?: string | null;
  certificateExpiryDate?: string | Date | null;
};

export type UpdateEnrollmentProgressReq = {
  courseId: UUID;
  lessonId: UUID;
};
export type UpdateCurrentViewReq = {
  courseId: UUID;
  currentLessonId: UUID;
  watchedSeconds?: number;
};

export type EnrollResponse = ApiResponse<Enrollment>;

export type EnrolledCourseItem = {
  id: UUID;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructorId: string;
};

export type GetEnrolledCourseFilterReq = {
  Page?: number;
  PageSize?: number;
  ProgressStatus?: EnrollmentProgressStatus;
  EnrollmentStatus?: EnrollmentStatus;
  SortBy?: "Date";
  SortDescending?: boolean;
};

export type GetEnrolledCoursesResponse = ApiResponse<EnrolledCourseItem[]>;
export type UpdateEnrollmentResponse = ApiResponse<Enrollment>;
export type UpdateEnrollmentProgressResponse = ApiResponse<Enrollment>;
export type UpdateCurrentViewResponse = ApiResponse<Enrollment>;
export type GetEnrolledCourseCompletedLessonsResponse = ApiResponse<UUID[]>;
export type IsEnrolledResponse = ApiResponse<{
  success: boolean;
  message: string;
  enrollment: Enrollment | null;
}>;

export type GetCourseEnrolledStudentsResponse = ApiResponse<{
  success: boolean;
  message: string;
  students: string[];
}>;

export type GetLastDateCourseResponse = ApiResponse<Date | string>;
