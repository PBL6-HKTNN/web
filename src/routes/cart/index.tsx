import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, CreditCard, AlertCircle, RefreshCw, ArrowLeft, Receipt } from 'lucide-react'
import { CartItemComponent } from '@/components/payment/cart/cart-item'
import { useCartPage } from './-hook'
import { formatPrice } from '@/utils/format'
import { Link } from '@tanstack/react-router'
import { MethodPayment } from '@/types/db/payment'
import { authGuard } from '@/utils'

export const Route = createFileRoute('/cart/')({  
  component: RouteComponent,
  beforeLoad: authGuard
})

function RouteComponent() {
  const {
    cartItems,
    totalAmount,
    totalItems,
    isLoading,
    hasError,
    isEmpty,
    isProcessing,
    hasOngoingPayment,
    handleCheckout,
    refetch
  } = useCartPage()

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to load cart</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading your cart. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/course" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          {totalItems > 0 && (
            <Badge variant="secondary">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>
      </div>

      {isEmpty ? (
        /* Empty Cart State */
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Browse our courses and add some to your cart to get started.
            </p>
            <Link to="/course">
              <Button>
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Cart with Items */
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Cart Items ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {cartItems.map((item, index) => (
                  <div key={item.courseId}>
                    <CartItemComponent item={item} />
                    {index < cartItems.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => handleCheckout(MethodPayment.STRIPE)}
                    disabled={isProcessing || hasOngoingPayment!}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : hasOngoingPayment ? 'Complete Current Payment First' : 'Proceed to Checkout'}
                  </Button>
                  
                  {hasOngoingPayment && (
                    <div className='space-y-2'>
                      <div className="text-sm text-amber-600 dark:text-amber-400 text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                        You have an unfinished payment. Please complete it before starting a new checkout.
                      </div>
                      <Link to='/checkout' className="text-sm text-blue-500">
                        <Button variant="default" className="w-full cursor-pointer">
                          <Receipt className="h-4 w-4 mr-2" />
                          View Ongoing Payment
                        </Button>
                      </Link>
                    </div>

                  )}
                  
                  <Link to="/course" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  <p>Secure checkout powered by Stripe</p>
                  <p>30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}