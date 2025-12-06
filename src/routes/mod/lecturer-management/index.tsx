import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import {

  FileText,
} from 'lucide-react'
import { useGetRequests } from '@/hooks/queries/request-hooks'
import { RequestListing } from '@/components/request/request-listing'
import { RequestTypeEnum } from '@/types/db/request'


export const Route = createFileRoute('/mod/lecturer-management/')({
  component: RouteComponent,
})

function RouteComponent() {

  const { data: requestsRes, isLoading } = useGetRequests()
  const requests = requestsRes?.data || []

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lecturer Applications Management</h1>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Review Guidelines
        </Button>
      </div>

      {/* Request Listings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor Role Requests</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Review requests from users to become instructors
          </p>
        </CardHeader>
        <CardContent>
          <RequestListing
            requests={requests}
            isLoading={isLoading}
            isModerator={true}
            fixedRequestTypeFilter={[RequestTypeEnum.INSTRUCTOR_ROLE]}
            viewMode="table"
          />
        </CardContent>
      </Card>

    </div>
  )
}
