import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Lock } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { CheckoutForm } from "@/components/payment/checkout-form";

interface CheckoutSummaryProps {
  totalAmount: number;
  totalItems: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentData: any;
  handlePurchase: () => void;
}

export function CheckoutSummary({
  totalAmount,
  totalItems,
  paymentData,
  handlePurchase,
}: CheckoutSummaryProps) {
  return (
    <div className="sticky top-8 space-y-6">
      <Card className="border-none shadow-2xl bg-card overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
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

            <Separator className="opacity-50" />

            <div className="flex justify-between items-end pt-2">
              <div className="space-y-1">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                  Total to Pay
                </p>
                <p className="text-4xl font-black text-primary tracking-tighter">
                  {formatPrice(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <CheckoutForm
              onSuccess={handlePurchase}
              paymentData={paymentData}
              totalAmount={totalAmount}
            />
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Secure Payment via Stripe
            </div>
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed px-4">
              Your payment information is encrypted and never stored on our
              servers.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
        <h4 className="text-sm font-black mb-2">Why buy from us?</h4>
        <ul className="text-xs text-muted-foreground space-y-2 font-medium">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            30-day money-back guarantee
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            Lifetime access to course materials
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary" />
            Verified certificate of completion
          </li>
        </ul>
      </div>
    </div>
  );
}
