import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/format";
import { Calendar, CreditCard, Package } from "lucide-react";
import type { PaymentData, OrderItem, OrderStatus, MethodPayment } from "@/types/db/payment";

interface PaymentCardProps {
  payment: PaymentData;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 0: // Pending
      return "secondary";
    case 1: // Completed
      return "default";
    case 2: // Failed
      return "destructive";
    case 3: // Cancelled
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Completed";
    case 2:
      return "Failed";
    case 3:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const getMethodText = (method: MethodPayment) => {
  switch (method) {
    case 0:
      return "Credit Card";
    case 1:
      return "PayPal";
    case 2:
      return "Bank Transfer";
    default:
      return "Other";
  }
};

export function PaymentCard({ payment: paymentData }: PaymentCardProps) {
  const { payment, orderItems } = paymentData;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Payment #{payment.id.slice(-8)}</CardTitle>
          </div>
          <Badge variant={getStatusColor(payment.orderStatus)}>
            {getStatusText(payment.orderStatus)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'Unknown'}
          </div>
          <span>•</span>
          <span>{getMethodText(payment.method)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Total Amount</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(payment.totalAmount)}
          </span>
        </div>
        
        {orderItems && orderItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Items ({orderItems.length})</span>
              </div>
              <div className="space-y-2">
                {orderItems.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.courseTitle}
                        className="w-12 h-8 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.courseTitle}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}