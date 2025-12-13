import type { Base, UUID } from "@/types/core";
import type { ApiResponse } from "@/types/core/api";
import type { Course } from "../course";
export * from "./cart";
// Enums from swagger - using const assertions instead of enum
export const MethodPayment = {
  CREDIT_CARD: 0,
  PAYPAL: 1,
  STRIPE: 2,
} as const;

export type MethodPayment = (typeof MethodPayment)[keyof typeof MethodPayment];

export const OrderStatus = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  CANCELLED: 3,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

// Core entities
export type Payment = Base & {
  paymentDate: string;
  method: MethodPayment;
  userId: UUID;
  totalAmount: number;
  orderStatus: OrderStatus;
};

export type OrderItem = {
  instructorId: UUID;
  description: string;
  price: number;
  courseId: UUID;
  courseTitle: string;
  thumbnailUrl: string;
};

// Request types
export interface PaymentRequest {
  method: MethodPayment;
  courseIds: UUID[];
}

export interface UpdatePaymentRequest {
  paymentId: UUID;
  status: OrderStatus;
}

export interface PaymentIntentRequest {
  paymentId: UUID;
  amount: number;
  paymentMethodId?: string;
}

// Payment intent response data
export interface PaymentIntentData {
  clientSecret: string;
  paymentId: string;
  amount: number;
  currency: string;
}
export type PaymentData = {
  payment: Payment;
  orderItems: OrderItem[];
};

// API Response types using standardized ApiResponse
export type CreatePaymentResponse = ApiResponse<PaymentData>;
export type PaymentResponse = ApiResponse<PaymentData>;
export type PaymentListResponse = ApiResponse<PaymentData[]>;
export type UpdatePaymentResponse = ApiResponse<PaymentData>;
export type PaymentIntentResponse = ApiResponse<PaymentIntentData>;
export type WebhookResponse = ApiResponse<null>;

export type GetRevenueRequest = {
  startDate: string;
  endDate: string;
};

export type GetRevenueResponse = ApiResponse<{
  totalRevenue: number;
  totalOrders: number;
  paymentDtos: {
    payment: Payment;
    orderItems: OrderItem[];
  }[];
}>;

export type GetAnalyticsRequest = Partial<GetRevenueRequest> & {
  instructorId: UUID;
  courseId?: UUID;
};

export type GetAnalyticsResponse = ApiResponse<{
  totalRevenue: number;
  totalOrders: number;
  monthlyRevenue: number[];
  top5CourseRevenue: Course[];
}>;

export type GetMyPaymentsResponse = GetRevenueResponse;
