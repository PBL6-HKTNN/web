import { Link } from "@tanstack/react-router";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CheckoutHeaderProps {
  totalItems: number;
}

export function CheckoutHeader({ totalItems }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-6">
        <Link
          to="/cart"
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Complete your purchase for{" "}
            <span className="text-foreground font-bold">{totalItems}</span>{" "}
            {totalItems === 1 ? "course" : "courses"}
          </p>
        </div>
      </div>
      {totalItems > 0 && (
        <Badge
          variant="secondary"
          className="hidden md:flex px-4 py-1 text-sm font-black uppercase tracking-widest"
        >
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </Badge>
      )}
    </div>
  );
}
