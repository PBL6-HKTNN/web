import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItemComponent } from "@/components/payment/cart/cart-item";
import type { CartItem } from "@/types/db/payment";

interface CartItemsListProps {
  cartItems: CartItem[];
  totalItems: number;
}

export function CartItemsList({ cartItems, totalItems }: CartItemsListProps) {
  return (
    <Card className="border-none shadow-xl bg-card overflow-hidden">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          Courses in Cart
          <span className="text-sm font-bold text-muted-foreground ml-2">
            ({totalItems})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {cartItems.map((item) => (
            <div
              key={item.courseId}
              className="p-6 hover:bg-muted/20 transition-colors"
            >
              <CartItemComponent item={item} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
