import { createFileRoute } from '@tanstack/react-router'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Filter,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { adminTransactions } from '@/mock-data/admin-transactions'

interface Transaction {
  id: string
  user: string
  userEmail: string
  type: 'Course Purchase' | 'Withdrawal' | 'Refund'
  amount: number
  paymentMethod: 'Credit Card' | 'PayPal' | 'Bank Transfer'
  date: string
  course: string | null
  description: string
}
import { useState } from 'react'

export const Route = createFileRoute('/admin/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Mock data - sẽ thay thế bằng API calls
  const transactions = adminTransactions

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.course && transaction.course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || transaction.type.toLowerCase().replace(' ', '') === typeFilter
    return matchesSearch && matchesType
  })


  const getTypeBadge = (type: string) => {
    const variants = {
      'Course Purchase': 'default',
      'Withdrawal': 'secondary',
      'Refund': 'outline'
    } as const
    return <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>{type}</Badge>
  }

  const handleViewTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailModalOpen(true)
  }

  const totalRevenue = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = Math.abs(transactions
    .filter(t => t.amount < 0 && t.type === 'Withdrawal')
    .reduce((sum, t) => sum + t.amount, 0))

  const totalTransactions = transactions.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
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
                <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{transactions.length}</div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Type: {typeFilter === 'all' ? 'All' : typeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('coursepurchase')}>Course Purchase</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('withdrawal')}>Withdrawal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('refund')}>Refund</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.user}</div>
                        <div className="text-sm text-muted-foreground">{transaction.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <DollarSign className="w-3 h-3" />
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-sm">{transaction.date}</TableCell>
                    <TableCell className="text-sm">{transaction.course || '-'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTransactionDetail(transaction as Transaction)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-blue-600">Contact User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              {/* Transaction Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                <p className="font-mono text-sm">{selectedTransaction.id}</p>
              </div>

              {/* User Info */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">User</label>
                <div className="mt-1">
                  <p className="font-medium">{selectedTransaction.user}</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.userEmail}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">{getTypeBadge(selectedTransaction.type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className={`mt-1 flex items-center gap-1 font-medium ${
                    selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <DollarSign className="w-3 h-3" />
                    {selectedTransaction.amount > 0 ? '+' : ''}{selectedTransaction.amount}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="mt-1">{selectedTransaction.paymentMethod}</p>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="mt-1">{selectedTransaction.date}</p>
              </div>

              {/* Course (if applicable) */}
              {selectedTransaction.course && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Course</label>
                  <p className="mt-1">{selectedTransaction.course}</p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm">{selectedTransaction.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}