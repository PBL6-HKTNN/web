import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  Loader2,
  Calendar
} from 'lucide-react'
import type { PaymentData } from '@/types/db/payment'
import { OrderStatus as OrderStatusEnum } from '@/types/db/payment'
import { useTransactionListing } from './hooks'

interface TransactionListingProps {
  paymentDtos: PaymentData[]
  totalRevenue: number
  totalOrders: number
  isLoading?: boolean
  error?: Error | null
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export function TransactionListing({
  paymentDtos,
  totalRevenue,
  totalOrders,
  isLoading,
  error,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: TransactionListingProps) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredTransactions,
    selectedTransaction,
    isDetailModalOpen,
    setIsDetailModalOpen,
    getStatusBadge,
    getPaymentMethodLabel,
    formatDate,
    handleViewTransactionDetail,
  } = useTransactionListing(paymentDtos)

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  ${isLoading ? '...' : totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{isLoading ? '...' : totalOrders}</div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : filteredTransactions.length}
                </div>
                <p className="text-sm text-muted-foreground">Filtered Transactions</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Date Range Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">Start Date:</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <label className="text-sm font-medium">End Date:</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search transactions by ID, user, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === OrderStatusEnum.PENDING ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatusEnum.PENDING)}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === OrderStatusEnum.COMPLETED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatusEnum.COMPLETED)}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === OrderStatusEnum.FAILED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatusEnum.FAILED)}
              >
                Failed
              </Button>
              <Button
                variant={statusFilter === OrderStatusEnum.CANCELLED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatusEnum.CANCELLED)}
              >
                Cancelled
              </Button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading transactions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-red-600">
                      Error loading transactions: {error instanceof Error ? error.message : 'Unknown error'}
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No transactions found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((paymentDto) => {
                    const payment = paymentDto.payment
                    const statusBadge = getStatusBadge(payment.orderStatus)
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {payment.userId.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-medium text-green-600">
                            <DollarSign className="w-3 h-3" />
                            ${payment.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                        <TableCell className="text-sm">{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {paymentDto.orderItems.length > 0 ? (
                              <div className="space-y-1">
                                {paymentDto.orderItems.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="truncate max-w-[200px]">
                                    {item.courseTitle}
                                  </div>
                                ))}
                                {paymentDto.orderItems.length > 2 && (
                                  <div className="text-muted-foreground">
                                    +{paymentDto.orderItems.length - 2} more
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTransactionDetail(paymentDto)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedTransaction?.payment.id.substring(0, 8)}...
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                <p className="font-mono text-sm">{selectedTransaction.payment.id}</p>
              </div>

              {/* User Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="font-mono text-sm">{selectedTransaction.payment.userId}</p>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(selectedTransaction.payment.orderStatus).variant}>
                      {getStatusBadge(selectedTransaction.payment.orderStatus).label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="mt-1 flex items-center gap-1 font-medium text-green-600">
                    <DollarSign className="w-3 h-3" />
                    ${selectedTransaction.payment.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="mt-1">{getPaymentMethodLabel(selectedTransaction.payment.method)}</p>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                <p className="mt-1">{formatDate(selectedTransaction.payment.paymentDate)}</p>
              </div>

              {/* Order Items */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Courses ({selectedTransaction.orderItems.length})
                </label>
                <div className="space-y-3 border rounded-lg p-3">
                  {selectedTransaction.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {item.thumbnailUrl && (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.courseTitle}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            Instructor: {item.instructorId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
