import { createFileRoute } from '@tanstack/react-router'
import { useCheckoutPage } from './-hook'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CreditCard, X, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/utils/format'
import type { OrderItem } from '@/types/db/payment'

export const Route = createFileRoute('/checkout/')({ 
  component: RouteComponent,
})

function RouteComponent() {
  const {
    paymentData,
    isLoading,
    hasError,
    totalAmount,
    totalItems,
    isProcessingPayment,
    isCancelling,
    handlePurchase,
    handleCancelOrder,
    refetch
  } = useCheckoutPage()

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError || !paymentData) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <X className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment not found</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your payment. Please try again.
            </p>
            <div className="space-x-2">
              <Button onClick={() => refetch()} variant="outline">
                Retry
              </Button>
              <Link to="/cart">
                <Button>Back to Cart</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Checkout</h1>
          {totalItems > 0 && (
            <Badge variant="secondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentData.orderItems?.map((item: OrderItem, index: number) => (
                  <div key={item.courseId}>
                    <div className="flex gap-4">
                      {/* Course Thumbnail */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.courseTitle}
                          className="w-16 h-16 object-cover rounded-md border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-course.jpg'; // Fallback image
                          }}
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium">{item.courseTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < (paymentData.orderItems?.length || 0) - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isProcessingPayment || isCancelling}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Purchase
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCancelOrder}
                  disabled={isProcessingPayment || isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center pt-4">
                <p>Secure checkout powered by Stripe</p>
                <p>30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}