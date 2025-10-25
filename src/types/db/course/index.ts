import type { Base } from "@/types/core";
import type { Module, ModuleReq } from "./module";

export type Course = Base & {
  title: string;
  description?: string;
  thumbnail: string | null;
  status: string;
  duration: number;
  price: number;
  level: string;
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
