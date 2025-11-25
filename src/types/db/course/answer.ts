import type { UUID } from "@/types/core";

export type Answer = {
  answerId?: UUID;
  answerText: string;
  isCorrect: boolean;
};
