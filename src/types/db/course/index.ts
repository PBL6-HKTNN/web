import type { Base } from "@/types/core";
import type { Module, ModuleReq } from "./module";

export type Level = "Beginner" | "Intermediate" | "Advanced";

export type CourseStatus = "Draft" | "Published" | "Archived";

export type Course = Base & {
  title: string;
  description?: string;
  thumbnail: string | null;
  status: CourseStatus;
  duration: number;
  price: number;
  level: Level;
  numReviews: number;
  averageRating: number;
  modules: Module[];
};

export type CourseEditReq = {
  id?: string;
  title?: string;
  description?: string;
  thumbnail?: string | null;
  modules: ModuleReq[];
};
