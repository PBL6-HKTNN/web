import { Level, CourseStatus } from "@/types/db/course";
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

export type CourseStatusBadgeProps = {
  label: string;
  variant: "secondary" | "outline" | "destructive" | "default";
  className?: string;
  dotClass: string;
};

export function getCourseStatusBadgeProps(
  status: CourseStatus
): CourseStatusBadgeProps {
  switch (status) {
    case CourseStatus.PUBLISHED:
      return {
        label: "Published",
        variant: "secondary",
        className: "bg-green-50 text-green-700",
        dotClass: "bg-green-500",
      };
    case CourseStatus.DRAFT:
      return {
        label: "Draft",
        variant: "outline",
        className: "bg-yellow-50 text-yellow-700",
        dotClass: "bg-yellow-500",
      };
    case CourseStatus.ARCHIVED:
      return {
        label: "Archived",
        variant: "destructive",
        className: "bg-red-50 text-red-700",
        dotClass: "bg-red-500",
      };
    default:
      return {
        label: "Unknown",
        variant: "default",
        className: "",
        dotClass: "bg-gray-400",
      };
  }
}

export type UserRoleBadgeProps = {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
  className?: string;
};

export function getUserRoleBadgeProps(role: number): UserRoleBadgeProps {
  switch (role) {
    case 0: // ADMIN
      return {
        label: "Admin",
        variant: "destructive",
        className: "bg-red-50 text-red-700",
      };
    case 1: // MODERATOR
      return {
        label: "Moderator",
        variant: "secondary",
        className: "bg-purple-50 text-purple-700",
      };
    case 2: // INSTRUCTOR
      return {
        label: "Instructor",
        variant: "default",
        className: "bg-blue-50 text-blue-700",
      };
    case 3: // STUDENT
    default:
      return {
        label: "Student",
        variant: "outline",
        className: "bg-gray-50 text-gray-700",
      };
  }
}

export function getUserStatusBadgeProps(status: number): UserRoleBadgeProps {
  switch (status) {
    case 0: // ACTIVE
      return {
        label: "Active",
        variant: "secondary",
        className: "bg-green-50 text-green-700",
      };
    case 1: // INACTIVE
      return {
        label: "Inactive",
        variant: "outline",
        className: "bg-gray-50 text-gray-700",
      };
    case 2: // PENDING
      return {
        label: "Pending",
        variant: "default",
        className: "bg-yellow-50 text-yellow-700",
      };
    default:
      return {
        label: "Unknown",
        variant: "outline",
        className: "bg-gray-50 text-gray-700",
      };
  }
}

export const truncate = (string: string, length: number = 50) => {
  if (string.length <= length) {
    return string;
  }
  return string.slice(0, length) + "...";
};
