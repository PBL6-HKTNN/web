import { RequestStatus, RequestTypeEnum } from "@/types/db/request";

const REQUEST_TYPE_LABELS: Record<RequestTypeEnum, string> = {
  0: "Instructor Role",
  1: "Public Course",
  2: "Hide Course",
  3: "Report Course",
  4: "Report User",
};

const STATUS_COLORS: Record<number, string> = {
  [RequestStatus.Reviewing]: "bg-gray-100 text-gray-800",
  [RequestStatus.Approved]: "bg-green-100 text-green-800",
  [RequestStatus.Rejected]: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<number, string> = {
  [RequestStatus.Reviewing]: "Reviewing",
  [RequestStatus.Approved]: "Approved",
  [RequestStatus.Rejected]: "Rejected",
};

const REQUEST_TYPE_COLORS: Record<number, string> = {
  0: "bg-blue-100 text-blue-800 border-blue-200", // Instructor Role - Blue
  1: "bg-green-100 text-green-800 border-green-200", // Public Course - Green
  2: "bg-orange-100 text-orange-800 border-orange-200", // Hide Course - Orange
  3: "bg-red-100 text-red-800 border-red-200", // Report Course - Red
  4: "bg-purple-100 text-purple-800 border-purple-200", // Report User - Purple
};

export {
  REQUEST_TYPE_LABELS,
  REQUEST_TYPE_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
};
