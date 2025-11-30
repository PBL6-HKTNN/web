import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentData, OrderItem, OrderStatus, MethodPayment } from "@/types/db/payment";

interface PaymentDetailRowProps {
  paymentData: PaymentData;
  isExpanded: boolean;
  onToggle: () => void;
  getStatusColor: (status: OrderStatus) => "default" | "secondary" | "destructive" | "outline";
  getStatusText: (status: OrderStatus) => string;
  getMethodText: (method: MethodPayment) => string;
  formatPrice: (price: number) => string;
}

export function PaymentDetailRow({
  paymentData,
  isExpanded,
  onToggle,
  getStatusColor,
  getStatusText,
  getMethodText,
  formatPrice,
}: PaymentDetailRowProps) {
  const { payment, orderItems } = paymentData;

  return (
    <>
      <TableRow 
        className="hover:bg-muted/50 cursor-pointer"
        onClick={onToggle}
      >
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </TableCell>
        <TableCell className="font-medium">
          #{payment.id.slice(-8)}
        </TableCell>
        <TableCell>
          {payment.createdAt
            ? new Date(payment.createdAt).toLocaleDateString()
            : "Unknown"}
        </TableCell>
        <TableCell className="font-semibold">
          {formatPrice(payment.totalAmount)}
        </TableCell>
        <TableCell>{getMethodText(payment.method)}</TableCell>
        <TableCell>
          <Badge variant={getStatusColor(payment.orderStatus)}>
            {getStatusText(payment.orderStatus)}
          </Badge>
        </TableCell>
        <TableCell>{orderItems.length} item(s)</TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/40">
          <TableCell colSpan={7} className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Order Items</span>
              </div>

              {orderItems.length > 0 ? (
                <div className="space-y-3">
                  {orderItems.map((item: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded border bg-card"
                    >
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.courseTitle}
                          className="w-16 h-10 object-cover rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.courseTitle}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Instructor ID: {item.instructorId.slice(-6)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No items in this order
                </p>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
