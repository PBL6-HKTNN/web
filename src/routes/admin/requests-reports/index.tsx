import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGetRequests } from '@/hooks/queries/request-hooks'
import { RequestListing } from '@/components/request/request-listing'
import { RequestTypeEnum } from '@/types/db/request'

export const Route = createFileRoute('/admin/requests-reports/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: requestsRes, isLoading } = useGetRequests()
  const requests = requestsRes?.data || []

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Requests & Reports Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests and Reports</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage all user requests and reports from a centralized location
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="mt-6">
              <RequestListing
                requests={requests}
                isLoading={isLoading}
                isModerator={true}
                fixedRequestTypeFilter={[
                  RequestTypeEnum.INSTRUCTOR_ROLE,
                  RequestTypeEnum.PUBLIC_A_COURSE,
                  RequestTypeEnum.HIDE_A_COURSE,
                ]}
                viewMode="table"
              />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
