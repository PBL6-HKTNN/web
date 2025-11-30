import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Award,
  FileText,
} from 'lucide-react'
import { lecturerApplications } from '@/mock-data/lecturer-applications'
  
interface LecturerApplication {
  id: string
  applicantName: string
  applicantEmail: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submittedDate: string
  specialization: string
  experience: string
  qualifications: string[]
  portfolio: string
  motivation: string
  coursesProposed: string[]
  references: string[]
  expectedStudents: number
  coursePrice: number
  applicationScore: number
  rejectionReason?: string
}

export const Route = createFileRoute('/mod/lecturer-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<LecturerApplication | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const filteredApplications = lecturerApplications.filter(application => {
    const matchesSearch = application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'pending' && application.status === 'Pending') ||
                         (statusFilter === 'approved' && application.status === 'Approved') ||
                         (statusFilter === 'rejected' && application.status === 'Rejected')
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'outline',
      'Approved': 'outline',
      'Rejected': 'default'
    } as const
    const icons = {
      'Pending': <Clock className='w-3 h-3' />,
      'Approved': <CheckCircle className='w-3 h-3' />,
      'Rejected': <XCircle className='w-3 h-3' />
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className='flex items-center gap-1'>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    )
  }

  const handleViewApplication = (application: LecturerApplication) => {
    setSelectedApplication(application)
    setRejectionReason('')
    setIsDetailModalOpen(true)
  }

  const handleApproveApplication = () => {
    // In a real app, this would call an API
    alert(`Application from ${selectedApplication?.applicantName} has been approved!`)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
  }

  const handleRejectApplication = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.')
      return
    }
    // In a real app, this would call an API
    alert(`Application from ${selectedApplication?.applicantName} has been rejected. Reason: ${rejectionReason}`)
    setIsDetailModalOpen(false)
    setSelectedApplication(null)
    setRejectionReason('')
  }

  const pendingApplications = lecturerApplications.filter(a => a.status === 'Pending').length
  const approvedApplications = lecturerApplications.filter(a => a.status === 'Approved').length
  const rejectedApplications = lecturerApplications.filter(a => a.status === 'Rejected').length

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lecturer Applications Management</h1>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Review Guidelines
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{pendingApplications}</div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{approvedApplications}</div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{rejectedApplications}</div>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lecturer Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search applications by name, email, or specialization..."
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
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('rejected')}>Rejected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{application.applicantName}</div>
                          <div className="text-sm text-muted-foreground">{application.applicantEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{application.specialization}</Badge>
                    </TableCell>
                    <TableCell>{application.experience}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-sm">{application.submittedDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplication(application as LecturerApplication)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No applications found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lecturer Application Details</DialogTitle>
            <DialogDescription>
              Review the application from {selectedApplication?.applicantName}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {selectedApplication.applicantName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{selectedApplication.applicantName}</h3>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {selectedApplication.applicantEmail}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Submitted {selectedApplication.submittedDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{selectedApplication.specialization}</Badge>
                        <span className="text-sm text-muted-foreground">{selectedApplication.experience} experience</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedApplication.qualifications.map((qual: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span>{qual}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a
                      href={selectedApplication.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Portfolio →
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Motivation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Teaching Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{selectedApplication.motivation}</p>
                </CardContent>
              </Card>

             
              
              {/* Rejection Reason (if rejected) */}
              {selectedApplication?.status === 'Rejected' && selectedApplication?.rejectionReason && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Rejection Reason</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">{selectedApplication?.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason Input (for rejection) */}
              {selectedApplication?.status === 'Pending' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rejection Reason (if rejecting)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Reason for rejection</Label>
                      <Textarea
                        id="rejection-reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide a detailed reason for rejecting this application..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
            {selectedApplication?.status === 'Pending' && (
              <>
                <Button variant="destructive" onClick={handleRejectApplication}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Application
                </Button>
                <Button onClick={handleApproveApplication}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Application
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
