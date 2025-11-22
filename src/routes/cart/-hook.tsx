import { useMemo } from 'react'
import { useGetCart, useCreatePayment } from '@/hooks/queries/payment-hooks'
import { MethodPayment } from '@/types/db/payment'
import type { CartItem } from '@/types/db/payment/cart'
import type { UUID } from '@/types'

export function useCartPage() {
  const { data: cartData, isLoading, error, refetch } = useGetCart()
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePayment()

  const cartItems = useMemo(() => cartData?.data || [], [cartData?.data])
  
  // Calculate totals from items since API returns array directly
  const calculatedTotals = useMemo(() => {
    const itemTotal = cartItems.reduce((sum: number, item: CartItem) => {
      return sum + (item.price || 0)
    }, 0)
    const itemCount = cartItems.length
    
    return {
      total: itemTotal,
      count: itemCount
    }
  }, [cartItems])

  const handleCheckout = (method: MethodPayment = MethodPayment.STRIPE) => {
    if (cartItems.length === 0) return
    
    const courseIds: UUID[] = cartItems.map((item: CartItem) => item.courseId)
    
    createPayment({
      method,
      courseIds
    })
  }

  const isEmpty = cartItems.length === 0
  const hasError = !!error
  const isProcessing = isCreatingPayment

  return {
    cartItems,
    totalAmount: calculatedTotals.total,
    totalItems: calculatedTotals.count,
    isLoading,
    hasError,
    isEmpty,
    isProcessing,
    handleCheckout,
    refetch
  }
}