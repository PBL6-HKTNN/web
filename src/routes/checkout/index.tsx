import { createFileRoute } from '@tanstack/react-router'
import { useCheckoutPage } from './-hook'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, X, RefreshCw } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { OrderStatus } from '@/types/db/payment'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { stripePk } from '@/conf'
import { CheckoutHeader } from './-sections/checkout-header'
import { OrderDetails } from './-sections/order-details'
import { CheckoutSummary } from './-sections/checkout-summary'

const stripePromise = loadStripe(stripePk)

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
    handlePurchase,
    refetch
  } = useCheckoutPage()

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-2xl w-1/3"></div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-muted rounded-3xl"></div>
            </div>
            <div className="h-96 bg-muted rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError || !paymentData) {
    return (
      <div className="container max-w-4xl mx-auto py-20">
        <Card className="border-none shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <X className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Payment not found</h2>
              <p className="text-muted-foreground font-medium">
                There was an error loading your payment. Please try again.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => refetch()} variant="outline" size="lg" className="font-bold rounded-full px-8">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Link to="/cart">
                <Button size="lg" className="font-bold rounded-full px-8">Back to Cart</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if payment is already completed (status = COMPLETED = 1)
  const isPaymentCompleted = (paymentData.payment.orderStatus !== OrderStatus.PENDING);

  if (isPaymentCompleted) {
    return (
      <div className="container max-w-4xl mx-auto py-20">
        <Card className="border-none shadow-2xl">
          <CardContent className="p-12 text-center space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto border-4 border-background shadow-xl">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tight">Payment Completed</h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Your payment has already been processed successfully.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link to="/your-courses">
                <Button size="lg" className="h-14 px-10 text-lg font-black rounded-full shadow-xl shadow-primary/20 group">
                  View My Courses
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/cart">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-black rounded-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <CheckoutHeader totalItems={totalItems} />

        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <OrderDetails orderItems={paymentData.orderItems} />
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              totalAmount={totalAmount}
              totalItems={totalItems}
              paymentData={paymentData}
              handlePurchase={handlePurchase}
            />
          </div>
        </div>
      </div>
    </Elements>
  )
}
