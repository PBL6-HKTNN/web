import { Level } from "@/types/db/course";
import { LessonType } from "@/types/db/course/lesson";
export function renderLevelLabel(level: Level): string {
  switch (level) {
    case Level.BEGINNER:
      return "Beginner";
    case Level.INTERMEDIATE:
      return "Intermediate";
    case Level.ADVANCED:
      return "Advanced";
    default:
      return "Unknown";
  }
}

export function renderLessonType(lessonType: LessonType): string {
  switch (lessonType) {
    case LessonType.MARKDOWN:
      return "Text";
    case LessonType.VIDEO:
      return "Video";
    case LessonType.QUIZ:
      return "Quiz";
    default:
      return "Unknown";
  }
}

export function renderStatus(status: number): string {
  switch (status) {
    case 0:
      return "Draft";
    case 1:
      return "Published";
    case 2:
      return "Archived";
    default:
      return "Unknown";
  }
}
