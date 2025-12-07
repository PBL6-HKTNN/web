import { createFileRoute } from '@tanstack/react-router'
import { useGetRequests, useGetRequestTypes } from '@/hooks/queries/request-hooks'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText, AlertTriangle, ArrowRight } from 'lucide-react'
import { RequestStatus, RequestTypeEnum } from '@/types/db/request'

export const Route = createFileRoute('/mod/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: requestsRes } = useGetRequests()
  const { data: requestTypesRes } = useGetRequestTypes()
  const requests = requestsRes?.data || []
  const requestTypes = requestTypesRes?.data || []

  // Count requests by type
  const courseAccessRequests = requests.filter((r) => {
    const type = requestTypes.find((t) => t.id === r.requestTypeId)
    return (
      type &&
      (type.type === RequestTypeEnum.PUBLIC_A_COURSE || type.type === RequestTypeEnum.HIDE_A_COURSE) &&
      r.status === RequestStatus.Reviewing
    )
  }).length

  const instructorRequests = requests.filter((r) => {
    const type = requestTypes.find((t) => t.id === r.requestTypeId)
    return (
      type &&
      type.type === RequestTypeEnum.INSTRUCTOR_ROLE &&
      r.status === RequestStatus.Reviewing
    )
  }).length

  const reportRequests = requests.filter((r) => {
    const type = requestTypes.find((t) => t.id === r.requestTypeId)
    return (
      type &&
      (type.type === RequestTypeEnum.REPORT_A_COURSE || type.type === RequestTypeEnum.REPORT_A_REVIEW) &&
      r.status === RequestStatus.Reviewing
    )
  }).length

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage courses, requests, and reports</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Course Access Requests Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/mod/courses' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              {courseAccessRequests > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {courseAccessRequests}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">Course Access Requests</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage public course and hide course requests
            </p>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View Requests
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Instructor Role Requests Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/mod/lecturer-management' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              {instructorRequests > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {instructorRequests}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">Instructor Role Requests</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review user requests to become instructors
            </p>
            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
              View Requests
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Report Requests Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/mod/reports-management' })}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              {reportRequests > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {reportRequests}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">Report Requests</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage reports about courses and reviews
            </p>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              View Reports
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Request Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <p className="text-3xl font-bold text-orange-600">
                {courseAccessRequests + instructorRequests + reportRequests}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{requests.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Approved/Rejected</p>
              <p className="text-3xl font-bold text-green-600">
                {requests.filter(
                  (r) =>
                    r.status === RequestStatus.Approved ||
                    r.status === RequestStatus.Rejected
                ).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

