import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetRequests } from '@/hooks/queries/request-hooks'
import { RequestListing } from '@/components/request/request-listing'
import { RequestTypeEnum } from '@/types/db/request'

export const Route = createFileRoute('/mod/reports-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: requestsRes, isLoading } = useGetRequests()
  const requests = requestsRes?.data || []

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Reports Management</h1>
      </div>

      {/* Request Listings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Report Requests</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Review reports from users about courses and reviews
          </p>
        </CardHeader>
        <CardContent>
          <RequestListing
            requests={requests}
            isLoading={isLoading}
            isModerator={true}
            fixedRequestTypeFilter={[
              RequestTypeEnum.REPORT_A_COURSE,
              RequestTypeEnum.REPORT_A_REVIEW,
            ]}
            viewMode="table"
          />
        </CardContent>
      </Card>      
    </div>
  )
}