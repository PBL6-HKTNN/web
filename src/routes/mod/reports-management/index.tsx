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
  Search,
  Filter,
  CheckCircle,
  Eye,
  AlertTriangle,
  User,
  BookOpen
} from 'lucide-react'
import { useState } from 'react'
import { reports } from '@/mock-data/reports'

export const Route = createFileRoute('/mod/reports-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase().replace(' ', '') === statusFilter
    return matchesSearch && matchesStatus
  }).filter(report => report.status === 'Pending' || report.status === 'Resolved')

  const getStatusBadge = (status: string) => {
    const icons = {
      'Pending': <AlertTriangle className='w-3 h-3' />,
      'Resolved': <CheckCircle className='w-3 h-3' />
    }
    return (
      <Badge variant="outline" className='flex items-center gap-1'>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    )
  }

  const pendingReports = reports.filter(r => r.status === 'Pending').length
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Reports Management</h1>
        {/* <Button>
          <Flag className="w-4 h-4 mr-2" />
          Bulk Actions
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{pendingReports}</div>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
                <p className="text-sm text-muted-foreground">Resolved Reports</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Reports Alert */}
      {/* {pendingReports > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Urgent Reports Pending</h3>
                <p className="text-sm text-red-700">
                  {pendingReports} report{pendingReports > 1 ? 's' : ''} require{pendingReports === 1 ? 's' : ''} immediate attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Report Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reports by student, course, or report type..."
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
                  Status: {statusFilter === 'all' ? 'All' : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('resolved')}>Resolved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reports Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.reportType}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                          {report.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{report.studentName}</div>
                          <div className="text-sm text-muted-foreground">{report.studentEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{report.courseTitle}</div>
                          <div className="text-sm text-muted-foreground">{report.courseId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-sm">{report.submittedDate}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}