import { useState } from 'react'
import { useGetRequestTypes, useCreateRequest, useGetUserRequests } from '@/hooks/queries/request-hooks'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import type { CreateRequestReq, RequestType } from '@/types/db/request'
import { RequestTypeEnum } from '@/types/db/request'
import { Label } from '@/components/ui/label'

export function ApplyForInstructorComponent() {
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Fetch request types
  const { data: requestTypesData, isLoading: isLoadingTypes } = useGetRequestTypes()
  const requestTypes = requestTypesData?.data || []

  // Fetch user's existing requests
  const { data: userRequestsData, isLoading: isLoadingUserRequests } = useGetUserRequests()
  const userRequests = userRequestsData?.data || []

  // Create request mutation
  const createRequestMutation = useCreateRequest()

  // Find the instructor role request type
  const instructorRequestType = isLoadingTypes ? undefined : requestTypes.find(
    (type: RequestType) => type.type === RequestTypeEnum.INSTRUCTOR_ROLE
  )

  // Check if user already has a pending instructor application
  const hasPendingApplication = userRequests.some((request) => {
    const isInstructorRequest = request.requestTypeId === instructorRequestType?.id
    const isPending = request.status === 0 // RequestStatus.Reviewing
    return isInstructorRequest && isPending
  })

  const isLoading = isLoadingTypes || isLoadingUserRequests || createRequestMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!description.trim()) {
      setError('Please provide a description for your application')
      return
    }

    if (!instructorRequestType) {
      setError('Instructor role request type not found')
      return
    }

    // Create the request
    const createReq: CreateRequestReq = {
      requestTypeId: instructorRequestType.id,
      description: description.trim(), // Empty courseId for instructor role request
    }

    createRequestMutation.mutate(createReq, {
      onSuccess: () => {
        setDescription('')
      },
    })
  }

  if (isLoading && !requestTypes.length && !userRequests.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  // User has pending application
  if (hasPendingApplication) {
    return (
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <CheckCircle className="h-5 w-5" />
            Application Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You already have a pending instructor role application. Our team will review your application and get back to you soon.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Instructor Role</CardTitle>
        <CardDescription>
          Tell us why you'd like to become an instructor. We'll review your application and get back to you soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Application Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your teaching experience, expertise, and why you want to become an instructor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Minimum 20 characters recommended for a better review
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !description.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
