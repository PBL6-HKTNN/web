import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useGetPayment, useUpdatePayment } from '@/hooks/queries/payment-hooks'
import { toast } from 'sonner'
import type { OrderItem } from '@/types/db/payment'

export function useCheckoutPage() {
  const router = useRouter()
  const { data: paymentResponse, isLoading, error, refetch } = useGetPayment()
  const { mutate: updatePayment, isPending: isCancelling } = useUpdatePayment()

  const paymentData = useMemo(() => paymentResponse?.data || null, [paymentResponse?.data])

  // Calculate totals from payment data
  const calculatedTotals = useMemo(() => {
    if (!paymentData?.orderItems) {
      return { total: 0, count: 0 }
    }

    const itemTotal = paymentData.orderItems.reduce((sum: number, item: OrderItem) => {
      return sum + (item.price || 0)
    }, 0)
    const itemCount = paymentData.orderItems.length
    
    return {
      total: itemTotal,
      count: itemCount
    }
  }, [paymentData?.orderItems])

  const handlePurchase = () => {
    // Navigate to courses after successful payment
    // updatePayment(
    //   {
    //     paymentId: paymentData?.payment.id as string,
    //     status: 1 // Completed status
    //   }
    // )
    setTimeout(() => {
      router.navigate({ to: '/your-courses' })
    }, 2000)
  }

  const handleCancelOrder = () => {
    if (!paymentData) {
      toast.error('Payment data not found')
      return
    }

    updatePayment(
      {
        paymentId: paymentData.payment.id,
        status: 3 // Cancel status
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast.success('Order cancelled successfully')
            // Navigate back to cart
            router.navigate({ to: '/cart' })
          } else {
            toast.error('Failed to cancel order')
          }
        },
        onError: () => {
          toast.error('Failed to cancel order')
        }
      }
    )
  }

  const hasError = !!error
  const isEmpty = !paymentData || !paymentData.orderItems || paymentData.orderItems.length === 0

  return {
    paymentData,
    isLoading,
    hasError,
    isEmpty,
    totalAmount: calculatedTotals.total,
    totalItems: calculatedTotals.count,
    isCancelling,
    handlePurchase,
    handleCancelOrder,
    refetch
  }
}