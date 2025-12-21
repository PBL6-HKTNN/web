import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCartPage } from "./-hook";
import { authGuard } from "@/utils";
import { CartHeader } from "./-sections/cart-header";
import { CartItemsList } from "./-sections/cart-items-list";
import { CartSummary } from "./-sections/cart-summary";
import { EmptyCart } from "./-sections/empty-cart";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
  beforeLoad: authGuard,
});

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
    refetch,
  } = useCartPage();

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded-2xl w-1/3"></div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-3xl"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container max-w-4xl mx-auto py-20">
        <Card className="border-none shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">
                Failed to load cart
              </h2>
              <p className="text-muted-foreground font-medium">
                There was an error loading your cart. Please try again.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="lg"
              className="font-bold rounded-full px-8"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <CartHeader totalItems={totalItems} />

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-10 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <CartItemsList cartItems={cartItems} totalItems={totalItems} />
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              totalAmount={totalAmount}
              totalItems={totalItems}
              isProcessing={isProcessing}
              hasOngoingPayment={hasOngoingPayment!}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      )}
    </div>
  );
}
