import { useState } from 'react'
import { useListPayments, useGetPayment } from '@/hooks/queries/payment-hooks'
import type { PaymentData } from '@/types/db/payment'

export function usePaymentSettings() {
  const { data: paymentsData, isLoading: isPaymentsLoading, error: paymentsError } = useListPayments();
  const { data: currentPaymentData, isLoading: isCurrentPaymentLoading, error: currentPaymentError } = useGetPayment();
  const payments = paymentsData?.data?.sort((a, b) => new Date(b.payment.paymentDate).getTime() - new Date(a.payment.paymentDate).getTime()) || [];
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const currentPayment = currentPaymentData?.data;
  const hasInProgressPayment = currentPayment && currentPayment.payment.orderStatus === 0; // PENDING status

  const getStatusStats = () => {
    const stats = payments.reduce((acc: Record<number, number>, paymentData: PaymentData) => {
      const status = paymentData.payment.orderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      completed: stats[1] || 0,
      pending: stats[0] || 0,
      failed: stats[2] || 0,
      cancelled: stats[3] || 0
    };
  };

  const getMonthlySpendingData = () => {
    const currentYear = new Date().getFullYear();
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toLocaleString('default', { month: 'short' }),
      amount: 0,
      count: 0,
    }));

    payments
      .filter((paymentData: PaymentData) => {
        const paymentDate = new Date(paymentData.payment.paymentDate);
        return paymentDate.getFullYear() === currentYear && paymentData.payment.orderStatus === 1; // Only completed payments
      })
      .forEach((paymentData: PaymentData) => {
        const paymentDate = new Date(paymentData.payment.paymentDate);
        const monthIndex = paymentDate.getMonth();
        monthlyData[monthIndex].amount += paymentData.payment.totalAmount;
        monthlyData[monthIndex].count += 1;
      });

    return monthlyData;
  };

  const totalSpent = payments
    .filter((paymentData: PaymentData) => paymentData.payment.orderStatus === 1) // Only completed payments
    .reduce((sum: number, paymentData: PaymentData) => sum + paymentData.payment.totalAmount, 0);

  const stats = getStatusStats();
  const monthlySpendingData = getMonthlySpendingData();

  const isLoading = isPaymentsLoading || isCurrentPaymentLoading;
  const error = paymentsError || currentPaymentError;

  return {
    // Data
    payments,
    currentPayment,
    hasInProgressPayment,
    totalSpent,
    stats,
    monthlySpendingData,

    // State
    viewMode,
    setViewMode,

    // Loading and error states
    isLoading,
    error,
  };
}