import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetRequests } from '@/hooks/queries/request-hooks'
import { RequestListing } from '@/components/request/request-listing'
import { RequestTypeEnum } from '@/types/db/request'

export const Route = createFileRoute('/mod/courses/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: requestsRes, isLoading } = useGetRequests()
  const requests = requestsRes?.data || []

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        {/* <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Review Queue
        </Button> */}
      </div>

      {/* Request Listings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Course Access Requests</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Review requests from users to make their courses public or hide them
          </p>
        </CardHeader>
        <CardContent>
          <RequestListing
            requests={requests}
            isLoading={isLoading}
            isModerator={true}
            fixedRequestTypeFilter={[
              RequestTypeEnum.PUBLIC_A_COURSE,
              RequestTypeEnum.HIDE_A_COURSE,
            ]}
            viewMode="table"
          />
        </CardContent>
      </Card>


    </div>
  )
}