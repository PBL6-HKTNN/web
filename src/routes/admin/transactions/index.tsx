import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useGetRevenue } from '@/hooks/queries/payment-hooks'
import { TransactionListing } from '@/components/admin/transactions/transaction-listing'

export const Route = createFileRoute('/admin/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Date range state - default to last 30 days
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  // Fetch revenue data from API
  const { data: revenueData, isLoading, error } = useGetRevenue({
    startDate: startDate ? new Date(startDate + 'T00:00:00.000Z').toISOString() : '',
    endDate: endDate ? new Date(endDate + 'T23:59:59.999Z').toISOString() : '',
  })

  // Extract payment data from API response
  const paymentDtos = revenueData?.data?.paymentDtos || []
  const totalRevenue = revenueData?.data?.totalRevenue || 0
  const totalOrders = revenueData?.data?.totalOrders || 0

  return (
    <TransactionListing
      paymentDtos={paymentDtos}
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      isLoading={isLoading}
      error={error}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
    />
  )
}