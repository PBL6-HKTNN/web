import { createFileRoute } from '@tanstack/react-router'
import { useGetUserRequests } from '@/hooks/queries/request-hooks'
import { RequestListing } from '@/components/request/request-listing'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { CodemyRequest } from '@/types/db/request'

export const Route = createFileRoute('/settings/request-history/')({
  component: RequestHistoryPage,
})

function RequestHistoryPage() {
  const { data: requestsRes, isLoading } = useGetUserRequests()
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  
  const requests = requestsRes?.data || []
  const handleEditRequest = (request: CodemyRequest) => {
    // TODO: Navigate to edit request dialog/page
    console.log('Edit request:', request)
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Request History</h1>
          <p className="text-gray-600 mt-2">
            View and manage all your submitted requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
        </div>
      </div>

      <RequestListing
        requests={requests}
        isLoading={isLoading}
        onEdit={handleEditRequest}
        viewMode={viewMode}
      />
    </div>
  )
}
