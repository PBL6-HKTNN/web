import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UUID } from "@/types";
import type {
  PaymentRequest,
  UpdatePaymentRequest,
  PaymentIntentRequest,
} from "@/types/db/payment";
import { paymentService } from "@/services/payment-service";

// Query Keys
export const PAYMENT_QUERY_KEYS = {
  all: ["payment"] as const,
  cart: () => [...PAYMENT_QUERY_KEYS.all, "cart"] as const,
  payments: () => [...PAYMENT_QUERY_KEYS.all, "payments"] as const,
  payment: () => [...PAYMENT_QUERY_KEYS.all, "payment"] as const,
};

// Cart Hooks
export const useGetCart = () => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.cart(),
    queryFn: paymentService.getCart,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => paymentService.addToCart(courseId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.cart() });
      if (data.isSuccess) {
        toast.success("Course added to cart successfully");
      } else {
        toast.error("Failed to add course to cart");
      }
    },
    onError: () => {
      toast.error("Failed to add course to cart");
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: UUID) => paymentService.removeFromCart(courseId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.cart() });
      if (data.isSuccess) {
        toast.success("Course removed from cart successfully");
      } else {
        toast.error("Failed to remove course from cart");
      }
    },
    onError: () => {
      toast.error("Failed to remove course from cart");
    },
  });
};

// Payment Hooks
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: PaymentRequest) =>
      paymentService.createPayment(paymentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.payments(),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.cart() });
      if (data.isSuccess) {
        toast.success("Payment created successfully");
      } else {
        toast.error("Failed to create payment");
      }
    },
    onError: () => {
      toast.error("Failed to create payment");
    },
  });
};

export const useGetPayment = () => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.payment(),
    queryFn: paymentService.getPayment,
  });
};

export const useListPayments = () => {
  return useQuery({
    queryKey: PAYMENT_QUERY_KEYS.payments(),
    queryFn: paymentService.listPayments,
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: UpdatePaymentRequest) =>
      paymentService.updatePayment(updateData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.payments(),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.payment() });
      if (data.isSuccess) {
        toast.success("Payment updated successfully");
      } else {
        toast.error("Failed to update payment");
      }
    },
    onError: () => {
      toast.error("Failed to update payment");
    },
  });
};

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (intentData: PaymentIntentRequest) =>
      paymentService.createPaymentIntent(intentData),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Payment intent created successfully");
      } else {
        toast.error("Failed to create payment intent");
      }
    },
    onError: () => {
      toast.error("Failed to create payment intent");
    },
  });
};

export const useProcessWebhook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookData: unknown) =>
      paymentService.processWebhook(webhookData),
    onSuccess: () => {
      // Invalidate relevant queries when webhook is processed
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.payments(),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.payment() });
    },
    onError: () => {
      toast.error("Failed to process webhook");
    },
  });
};

// Utility hooks
export const useCartOperations = () => {
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();

  return {
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
};

export const usePaymentOperations = () => {
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const createPaymentIntentMutation = useCreatePaymentIntent();

  return {
    createPayment: createPaymentMutation.mutate,
    updatePayment: updatePaymentMutation.mutate,
    createPaymentIntent: createPaymentIntentMutation.mutate,
    isCreatingPayment: createPaymentMutation.isPending,
    isUpdatingPayment: updatePaymentMutation.isPending,
    isCreatingPaymentIntent: createPaymentIntentMutation.isPending,
  };
};
