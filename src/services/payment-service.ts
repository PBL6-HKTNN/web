import api from "@/utils/api";
import API_ROUTES from "@/conf/constants/api-routes";
import type { UUID } from "@/types";
import type {
  GetCartResponse,
  AddToCartResponse,
  RemoveFromCartResponse,
  PaymentRequest,
  CreatePaymentResponse,
  PaymentResponse,
  PaymentListResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
  PaymentIntentRequest,
  PaymentIntentResponse,
  WebhookResponse,
  GetRevenueResponse,
  GetMyPaymentsResponse,
  GetAnalyticsResponse,
  GetAnalyticsRequest,
  GetRevenueRequest,
} from "@/types/db/payment";

export const paymentService = {
  // Cart services
  getCart: async (): Promise<GetCartResponse> => {
    const response = await api.get(API_ROUTES.PAYMENT.getCart);
    return response.data;
  },

  addToCart: async (courseId: UUID): Promise<AddToCartResponse> => {
    const response = await api.post(API_ROUTES.PAYMENT.addToCart(courseId));
    return response.data;
  },

  removeFromCart: async (courseId: UUID): Promise<RemoveFromCartResponse> => {
    const response = await api.delete(
      API_ROUTES.PAYMENT.removeFromCart(courseId)
    );
    return response.data;
  },

  // Payment services
  createPayment: async (
    paymentData: PaymentRequest
  ): Promise<CreatePaymentResponse> => {
    const response = await api.post(
      API_ROUTES.PAYMENT.createPayment,
      paymentData
    );
    return response.data;
  },

  getPayment: async (): Promise<PaymentResponse> => {
    const response = await api.get(API_ROUTES.PAYMENT.getPayment);
    return response.data;
  },

  listPayments: async (): Promise<PaymentListResponse> => {
    const response = await api.get(API_ROUTES.PAYMENT.listPayments);
    return response.data;
  },

  updatePayment: async (
    updateData: UpdatePaymentRequest
  ): Promise<UpdatePaymentResponse> => {
    const response = await api.post(
      API_ROUTES.PAYMENT.updatePayment,
      updateData
    );
    return response.data;
  },

  createPaymentIntent: async (
    intentData: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> => {
    const response = await api.post(
      API_ROUTES.PAYMENT.createPaymentIntent,
      intentData
    );
    return response.data;
  },

  processWebhook: async (webhookData: unknown): Promise<WebhookResponse> => {
    const response = await api.post(API_ROUTES.PAYMENT.webhook, webhookData);
    return response.data;
  },

  getRevenue: async (data: GetRevenueRequest): Promise<GetRevenueResponse> => {
    const res = await api.post<GetRevenueResponse>(
      API_ROUTES.PAYMENT.revenue,
      data
    );
    return res.data;
  },

  getAnalytics: async (
    data: GetAnalyticsRequest
  ): Promise<GetAnalyticsResponse> => {
    const res = await api.post<GetAnalyticsResponse>(
      API_ROUTES.PAYMENT.analytics,
      data
    );
    return res.data;
  },

  myPayments: async (): Promise<GetMyPaymentsResponse> => {
    const res = await api.get<GetMyPaymentsResponse>(
      API_ROUTES.PAYMENT.myPayments
    );
    return res.data;
  },
};
