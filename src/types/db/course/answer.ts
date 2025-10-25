import type { Base } from "@/types/core";

export type Answer = Base & {
  text: string;
  isCorrect: boolean;
};
