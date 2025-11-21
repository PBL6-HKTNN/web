import type { Base, UUID } from "@/types/core";
import type { Module, ModuleReq } from "./module";
import type { ApiResponse } from "@/types/core/api";

export const Level = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
} as const;

export type Level = (typeof Level)[keyof typeof Level];

const CourseStatus = {
  DRAFT: 0,
  PUBLISHED: 1,
  ARCHIVED: 2,
} as const;

export { CourseStatus };

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
  numberOfModules: number;
  numberOfReviews: number;
  averageRating: number;
  modules?: Module[];
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
  Language?: string;
  SortBy?: "name" | "date" | "rating";
  Page?: number;
  PageSize?: number;
};

//mock
export type CourseEditReq = {
  id?: UUID;
  title?: string;
  description?: string;
  thumbnail?: string | null;
  modules?: ModuleReq[];
};

export type ValidateCourseReq = {
  courseId: UUID;
  lessonId: UUID;
};

export type ValidateCourseRes = ApiResponse<boolean>;
