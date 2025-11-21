import type { UUID } from "@/types";
import type { ApiResponse } from "@/types/core/api";

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
export interface Payment {
  id: UUID;
  userId: UUID;
  courseIds: UUID[];
  method: MethodPayment;
  status: OrderStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
  stripePaymentIntentId?: string;
}

export interface Order {
  id: UUID;
  paymentId: UUID;
  userId: UUID;
  courseIds: UUID[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

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
}

// Payment intent response data
export interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
}

// API Response types using standardized ApiResponse
export type CreatePaymentResponse = ApiResponse<Payment>;
export type PaymentResponse = ApiResponse<Payment>;
export type PaymentListResponse = ApiResponse<Payment[]>;
export type UpdatePaymentResponse = ApiResponse<Payment>;
export type PaymentIntentResponse = ApiResponse<PaymentIntentData>;
export type WebhookResponse = ApiResponse<null>;
