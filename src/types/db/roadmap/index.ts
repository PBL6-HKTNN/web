import type { UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export type Roadmap = {
  roadmapId: UUID;
  title: string;
  description: string;
  progress: number;
};

export type RoadmapDetail = {
  roadmapId: UUID;
  title: string;
  description: string;
  isOwner: boolean;
  isJoined: boolean;
  progress: number;
  courseIds: UUID[];
};

export type CreateRoadmapReq = {
  title: string;
  description: string;
  courseIds: UUID[];
};

export type UpdateRoadmapReq = {
  title: string;
  description: string;
};

export type AddCourseToRoadmapReq = {
  courseId: UUID;
};

export type ReorderRoadmapCoursesReq = {
  courseIds: UUID[];
};

export type GetMyRoadmapsData = {
  roadmaps: Roadmap[];
};

export type GetRoadmapDetailData = {
  roadmap: RoadmapDetail;
};

export type CreateRoadmapData = {
  roadmapId?: UUID;
};

export type SyncRoadmapProgressData = {
  progress?: number;
};

// ============================================================================
// API Response Types
// ============================================================================

export type GetMyRoadmapsResponse = ApiResponse<GetMyRoadmapsData>;

export type GetRoadmapDetailResponse = ApiResponse<GetRoadmapDetailData>;

export type CreateRoadmapResponse = ApiResponse<CreateRoadmapData>;

export type UpdateRoadmapResponse = ApiResponse<null>;

export type JoinRoadmapResponse = ApiResponse<null>;

export type AddCourseToRoadmapResponse = ApiResponse<null>;

export type RemoveCourseFromRoadmapResponse = ApiResponse<null>;

export type ReorderRoadmapCoursesResponse = ApiResponse<null>;

export type SyncRoadmapProgressResponse = ApiResponse<SyncRoadmapProgressData>;

export type DeleteRoadmapResponse = ApiResponse<null>;
