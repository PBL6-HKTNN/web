import { type Base } from "../../core";

export const Level = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced"
} as const;

export type Level = (typeof Level)[keyof typeof Level];

export const Status = {
  Draft: "draft",
  Published: "published",
  Archived: "archived"
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export type Category = Base & {
  name: string;
  description: string;
}

export type Course = Base & {
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  status: Status;
  duration: number; // TimeSpan in minutes
  price: number;
  level: Level;
  categoryId: string;
  language: string;
  numberOfReviews: number;
  averageRating: number;
  category?: Category; // Optional populated category
  instructor?: {
    id: string;
    name: string;
    profilePicture?: string;
    bio?: string;
    rating?: number;
    studentsCount?: number;
    coursesCount?: number;
  }; // Optional populated instructor
  // Additional fields for course detail
  trailerVideo?: string; // URL to trailer video
  whatYouWillLearn?: string[];
  requirements?: string[];
  targetAudience?: string[];
  curriculum?: CurriculumSection[];
  reviews?: CourseReview[];
  totalStudents?: number;
  lastUpdated?: string;
  certificate?: boolean;
  subtitle?: string;
}

export type CurriculumSection = {
  id: string;
  title: string;
  duration: number; // in minutes
  lectures: CurriculumLecture[];
}

export type CurriculumLecture = {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'video' | 'quiz' | 'assignment' | 'article';
  preview?: boolean; // if available for free preview
}

export type CourseReview = Base & {
  userId: string;
  rating: number;
  comment: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// API Request/Response types
export type GetCoursesRequest = {
  search?: string;
  categoryId?: string;
  level?: Level;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'title' | 'price' | 'rating' | 'createdAt' | 'numberOfReviews';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export type GetCoursesResponse = {
  courses: Course[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type GetCategoriesResponse = {
  categories: Category[];
}
