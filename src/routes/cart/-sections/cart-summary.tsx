import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Receipt, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { MethodPayment } from "@/types/db/payment";
import { Link } from "@tanstack/react-router";

interface CartSummaryProps {
  totalAmount: number;
  totalItems: number;
  isProcessing: boolean;
  hasOngoingPayment: boolean;
  handleCheckout: (method: MethodPayment) => void;
}

export function CartSummary({
  totalAmount,
  totalItems,
  isProcessing,
  hasOngoingPayment,
  handleCheckout,
}: CartSummaryProps) {
  return (
    <div className="sticky top-8 space-y-6">
      <Card className="border-none shadow-2xl bg-card overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground pb-8">
          <CardTitle className="text-2xl font-black tracking-tight">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 -mt-4 bg-card rounded-t-3xl space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-base font-medium">
              <span className="text-muted-foreground">
                Subtotal ({totalItems} items)
              </span>
              <span className="font-bold">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span className="text-muted-foreground">Taxes</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
          </div>

          <Separator className="opacity-50" />

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                Total Amount
              </p>
              <p className="text-4xl font-black text-primary tracking-tighter">
                {formatPrice(totalAmount)}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
              onClick={() => handleCheckout(MethodPayment.STRIPE)}
              disabled={isProcessing || hasOngoingPayment}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              {isProcessing
                ? "Processing..."
                : hasOngoingPayment
                  ? "Complete Ongoing Payment"
                  : "Checkout Now"}
            </Button>

            {hasOngoingPayment && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 space-y-3">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-bold text-center">
                  You have an unfinished payment session.
                </p>
                <Link to="/checkout" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-bold"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Resume Payment
                  </Button>
                </Link>
              </div>
            )}

            <Link to="/course" className="block">
              <Button
                variant="ghost"
                className="w-full font-bold text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Secure SSL Checkout
          </div>
        </CardContent>
      </Card>

      <div className="px-4 py-6 rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/20">
        <p className="text-xs text-muted-foreground text-center font-medium leading-relaxed">
          By completing your purchase, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Refund Policy</span>.
        </p>
      </div>
    </div>
  );
}
