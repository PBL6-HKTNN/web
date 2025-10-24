import type { Base } from "@/types/core";
import type { Lesson, LessonReq } from "./lesson";

export type Module = Base & {
  title: string;
  duration: number;
  numLessons: number;
  order: number;
  lessons: Lesson[];
};

export type ModuleReq = {
  id?: string;
  title: string;
  order: number;
  lessons: LessonReq[];
};
