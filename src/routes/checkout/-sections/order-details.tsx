import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import type { OrderItem } from "@/types/db/payment";

interface OrderDetailsProps {
  orderItems: OrderItem[];
}

export function OrderDetails({ orderItems }: OrderDetailsProps) {
  return (
    <Card className="border-none shadow-xl bg-card overflow-hidden">
      <CardHeader className="bg-muted/30 pb-6">
        <CardTitle className="text-xl font-black">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {orderItems?.map((item) => (
            <div
              key={item.courseId}
              className="p-6 flex gap-6 hover:bg-muted/10 transition-colors"
            >
              <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-muted shadow-sm">
                <img
                  src={item.thumbnailUrl || "/placeholder-course.jpg"}
                  alt={item.courseTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-course.jpg";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black leading-tight truncate">
                      {item.courseTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-primary">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
