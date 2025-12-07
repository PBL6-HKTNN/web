import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";

export const RequestStatus = {
  Reviewing: 0,
  Approved: 1,
  Rejected: 2,
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const RequestTypeEnum = {
  INSTRUCTOR_ROLE: 0,
  PUBLIC_A_COURSE: 1,
  HIDE_A_COURSE: 2,
  REPORT_A_COURSE: 3,
  REPORT_A_REVIEW: 4,
} as const;
export type RequestTypeEnum =
  (typeof RequestTypeEnum)[keyof typeof RequestTypeEnum];

export type CodemyRequest = Base & {
  userId: UUID;
  requestTypeId: UUID;
  description: string;
  status: RequestStatus;
  courseId?: UUID;
  response?: string;
};

export type RequestType = Base & {
  type: RequestTypeEnum;
  description: string;
};

export type CreateRequestReq = {
  requestTypeId: UUID;
  description: string;
  courseId?: UUID;
  reviewId?: UUID;
};

export type UpdateRequestReq = Pick<CreateRequestReq, "description">;

export type ResolveRequestReq = {
  status: RequestStatus;
  requestId: UUID;
  response: string;
};

export type RequestApiRes = ApiResponse<CodemyRequest>;
export type RequestsApiRes = ApiResponse<CodemyRequest[]>;
export type RequestTypesApiRes = ApiResponse<RequestType[]>;
