import type { Base, UUID } from "@/types/core";
import type { Module } from "./module";
import type { ApiResponse } from "@/types/core/api";

export const Level = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
} as const;

export type Level = (typeof Level)[keyof typeof Level];

export const CourseStatus = {
  DRAFT: 0,
  PUBLISHED: 1,
  ARCHIVED: 2,
} as const;

export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus];

export type Course = Base & {
  instructorId: UUID;
  categoryId: UUID;
  title: string;
  description?: string;
  thumbnail: string | null;
  status: CourseStatus;
  duration: string; //00:00:00 format
  price: number;
  level: Level;
  language: string;
  totalEnrollments: number;
  numberOfModules: number;
  numberOfReviews: number;
  averageRating: number;
  modules?: Module[];
  isEnrolled?: boolean;
  isRequestedBanned?: boolean;
};

export type CreateCourseReq = {
  instructorId: UUID;
  categoryId: UUID;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  level: Level;
  language: string;
};

export type UpdateCourseReq = CreateCourseReq;

export type CreateCourseRes = ApiResponse<Course>;
export type GetCourseRes = ApiResponse<Course>;
export type GetCoursesRes = ApiResponse<Course[]>; // Exclude Base fields
export type UpdateCourseRes = ApiResponse<Course>;
export type DeleteCourseRes = ApiResponse<string>;

// TODO: remove api default response since things got duplicated
export type GetCourseModulesRes = ApiResponse<Module[]>;

export type GetCourseContentRes = ApiResponse<{
  course: Course;
  module: Module[];
}>;

export type GetCoursesFilterReq = {
  CategoryId?: UUID;
  Level?: Level;
  InstructorId?: UUID;
  Language?: string;
  SortBy?: "price" | "rating";
  Page?: number;
  PageSize?: number;
};

export type ValidateCourseReq = {
  courseId: UUID;
  lessonId: UUID;
};

export type ValidateCourseRes = ApiResponse<boolean>;

export type ChangeCourseStatusReq = {
  courseId: UUID;
  status: CourseStatus;
  moderatorId: UUID;
};

export type ChangeCourseStatusRes = ApiResponse<Course>;

export type ModChangeCourseStatusReq = ChangeCourseStatusReq;

export type ModChangeCourseStatusRes = ChangeCourseStatusRes;

export type PreSubmitCheckReq = {
  courseId: UUID;
};

export type PreSubmitCheckRes = ApiResponse<string>;

export type RequestedBanCourseRes = ApiResponse<{
  success: boolean;
  message: string;
}>;

export type CourseAnalyticsRes = ApiResponse<{
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
  totalEnrollments: number;
  monthlyNewEnrollments: number[];
  top5Courses: Course[];
}>;
