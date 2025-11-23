import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { PaymentDetailRow } from "./payment-detail-row";
import { formatPrice } from "@/utils/format";
import type { PaymentData, OrderStatus, MethodPayment } from "@/types/db/payment";

interface PaymentTableProps {
  payments: PaymentData[];
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

const getStatusText = (status: OrderStatus): string => {
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

const getMethodText = (method: MethodPayment): string => {
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

export function PaymentTable({ payments }: PaymentTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (paymentId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(paymentId)) {
      newExpandedRows.delete(paymentId);
    } else {
      newExpandedRows.add(paymentId);
    }
    setExpandedRows(newExpandedRows);
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No payments found</h3>
        <p className="text-muted-foreground">
          Your payment history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((paymentData) => (
            <PaymentDetailRow
              key={paymentData.payment.id}
              paymentData={paymentData}
              isExpanded={expandedRows.has(paymentData.payment.id)}
              onToggle={() => toggleRow(paymentData.payment.id)}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getMethodText={getMethodText}
              formatPrice={formatPrice}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
