import { useState, useMemo } from 'react'
import type { PaymentData, OrderStatus, MethodPayment } from '@/types/db/payment'
import { OrderStatus as OrderStatusEnum, MethodPayment as MethodPaymentEnum } from '@/types/db/payment'

export const useTransactionListing = (paymentDtos: PaymentData[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentData | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const filteredTransactions = useMemo(() => {
    return paymentDtos.filter(paymentDto => {
      const payment = paymentDto.payment
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paymentDto.orderItems.some(item => 
          item.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesStatus = statusFilter === 'all' || payment.orderStatus === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [paymentDtos, searchTerm, statusFilter])

  const getStatusBadge = (status: OrderStatus) => {
    const statusLabels = {
      [OrderStatusEnum.PENDING]: 'Pending',
      [OrderStatusEnum.COMPLETED]: 'Completed',
      [OrderStatusEnum.FAILED]: 'Failed',
      [OrderStatusEnum.CANCELLED]: 'Cancelled',
    } as const

    const variants = {
      [OrderStatusEnum.PENDING]: 'secondary',
      [OrderStatusEnum.COMPLETED]: 'default',
      [OrderStatusEnum.FAILED]: 'destructive',
      [OrderStatusEnum.CANCELLED]: 'outline',
    } as const

    return {
      variant: variants[status] || 'secondary',
      label: statusLabels[status] || 'Unknown',
    }
  }

  const getPaymentMethodLabel = (method: MethodPayment) => {
    const labels = {
      [MethodPaymentEnum.CREDIT_CARD]: 'Credit Card',
      [MethodPaymentEnum.PAYPAL]: 'PayPal',
      [MethodPaymentEnum.STRIPE]: 'Stripe',
    } as const

    return labels[method] || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewTransactionDetail = (paymentDto: PaymentData) => {
    setSelectedTransaction(paymentDto)
    setIsDetailModalOpen(true)
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTransactions,
    selectedTransaction,
    isDetailModalOpen,
    setIsDetailModalOpen,
    getStatusBadge,
    getPaymentMethodLabel,
    formatDate,
    handleViewTransactionDetail,
  }
}

