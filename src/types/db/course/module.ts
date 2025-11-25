import type { Base, UUID } from "@/types/core";
import type { Lesson, LessonReq } from "./lesson";
import type { ApiResponse } from "@/types/core/api";

export type Module = Base & {
  title: string;
  duration: number;
  numberOfLessons: number;
  order: number;
  courseId: UUID;
  lessons?: Lesson[];
};

export type CreateModuleReq = {
  title: string;
  order: number;
  courseId: UUID;
};

export type UpdateModuleReq = CreateModuleReq;

export type CreateModuleRes = ApiResponse<Module>;
export type GetModuleRes = ApiResponse<Module>;
export type GetModulesRes = ApiResponse<Module[]>;
export type UpdateModuleRes = ApiResponse<Module>;
export type DeleteModuleRes = ApiResponse<string>;

export type GetLessonsByModuleRes = ApiResponse<Lesson[]>;

//mock
export type ModuleReq = {
  id?: string;
  title: string;
  order: number;
  lessons: LessonReq[];
};
