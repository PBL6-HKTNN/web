import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Receipt, AlertCircle, LayoutGrid, LayoutList, ArrowRight, ShoppingCart } from 'lucide-react'
import { PaymentCard } from '@/components/payment/payment-card'
import { PaymentTable } from '@/components/payment/payment-table'
import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/utils/format'
import type { PaymentData, OrderItem } from '@/types/db/payment'
import { usePaymentSettings } from './-hook'

export const Route = createFileRoute('/settings/payment/')({ 
  component: RouteComponent,
})

function RouteComponent() {
  const {
    payments,
    currentPayment,
    hasInProgressPayment,
    totalSpent,
    stats,
    viewMode,
    setViewMode,
    isLoading,
    error,
  } = usePaymentSettings();

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load payments</h3>
          <p className="text-muted-foreground">There was an error loading your payment history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            View your payment history and transaction details.
          </p>
        </div>
        
        {/* In Progress Payment */}
        {hasInProgressPayment && currentPayment && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">In Progress Payment</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                  Pending
                </Badge>
              </div>
              <CardDescription className="text-yellow-700 dark:text-yellow-300">
                You have an unfinished payment. Complete your purchase to access your courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {currentPayment.orderItems?.length || 0} course{(currentPayment.orderItems?.length || 0) !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total: {formatPrice(currentPayment.payment.totalAmount)}
                    </p>
                  </div>
                  <Link to="/checkout">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600">
                      Continue Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-2">
                  {currentPayment.orderItems?.slice(0, 3).map((item: OrderItem) => (
                    <div key={item.courseId} className="flex items-center gap-3 p-2 bg-white dark:bg-yellow-800 rounded border">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.courseTitle}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-course.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.courseTitle}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  {(currentPayment.orderItems?.length || 0) > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{(currentPayment.orderItems?.length || 0) - 3} more course{(currentPayment.orderItems?.length || 0) - 3 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Payment Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-2xl text-primary">
                ${totalSpent.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {stats.completed}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">
                {stats.pending}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Failed/Cancelled</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {stats.failed + stats.cancelled}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        
        {/* Payment List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <Badge variant="secondary">{payments.length}</Badge>
            </div>
            {payments.length > 0 && (
              <div className="flex gap-2 bg-muted p-1 rounded">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="h-8"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {payments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                <p className="text-muted-foreground">
                  You haven't made any payments yet. Your transaction history will appear here.
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'card' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {payments.map((paymentData: PaymentData) => (
                <PaymentCard key={paymentData.payment.id} payment={paymentData} />
              ))}
            </div>
          ) : (
              <PaymentTable payments={payments} />
          )}
      </div>
    </div>
  )
}