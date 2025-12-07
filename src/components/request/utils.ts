import { RequestStatus, RequestTypeEnum } from "@/types/db/request";

const REQUEST_TYPE_LABELS: Record<RequestTypeEnum, string> = {
  0: "Instructor Role",
  1: "Public Course",
  2: "Hide Course",
  3: "Report Course",
  4: "Report User",
};

const STATUS_COLORS: Record<number, string> = {
  [RequestStatus.Reviewing]:
    "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700",
  [RequestStatus.Approved]:
    "bg-green-100 text-green-800 dark:bg-green-900/10 dark:text-green-300 border border-green-200 dark:border-green-800",
  [RequestStatus.Rejected]:
    "bg-red-100 text-red-800 dark:bg-red-900/10 dark:text-red-300 border border-red-200 dark:border-red-800",
};

const STATUS_LABELS: Record<number, string> = {
  [RequestStatus.Reviewing]: "Reviewing",
  [RequestStatus.Approved]: "Approved",
  [RequestStatus.Rejected]: "Rejected",
};

const REQUEST_TYPE_COLORS: Record<number, string> = {
  0: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800", // Instructor Role - Blue
  1: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/10 dark:text-green-300 dark:border-green-800", // Public Course - Green
  2: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/10 dark:text-orange-300 dark:border-orange-800", // Hide Course - Orange
  3: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/10 dark:text-red-300 dark:border-red-800", // Report Course - Red
  4: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/10 dark:text-purple-300 dark:border-purple-800", // Report User - Purple
};

export {
  REQUEST_TYPE_LABELS,
  REQUEST_TYPE_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
};
