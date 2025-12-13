import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { authGuard } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useCourseDetailPage } from './-hook'
import { CoursePublicCheckModal } from '@/components/course/course-public-check'
import { useCoursePublicCheck } from '@/components/course/course-public-check/hook'
import { CourseHideForm } from '@/components/course/course-hide-form'
import { useCourseHideForm } from '@/components/course/course-hide-form/hook'
// ReviewList now located in tabs component
import { Suspense, lazy } from 'react'
const CourseGeneralInfo = lazy(() => import('./-sections/general-info'))
const CourseTabs = lazy(() => import('./-sections/tabs'))
import { useGetReviewsByCourse, useGetAverageRatingByCourse } from '@/hooks/queries/review-hooks'
// CourseStatus/Level are used in the general-info section

export const Route = createFileRoute('/lecturing-tool/course/$courseId/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const { course, modules, isLoading, error } = useCourseDetailPage(courseId)
  const { isOpen, isChecking, isSubmitting, checkResults, checkError, submitError, openModal, closeModal, performCheck, submitPublication } =
    useCoursePublicCheck(courseId)
  const { isOpen: isHideFormOpen, isSubmitting: isHiding, form: hideForm, openModal: openHideForm, closeModal: closeHideForm, onSubmit: onHideSubmit } =
    useCourseHideForm(courseId)
  
  // Review hooks
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsByCourse(courseId)
  const { data: averageRatingData, isLoading: averageRatingLoading } = useGetAverageRatingByCourse(courseId)
  
  const reviews = reviewsData?.data || []
  const averageRating = averageRatingData?.data?.averageRating || 0

  // formatNumber no longer needed here; tabs use their own formatting

  if (isLoading) {
    return <CourseDetailSkeleton />
  }

  if (error || !course) {
    return (
      <div className="w-full container mx-auto py-8">
        <div className="mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Course</h2>
              <p className="text-muted-foreground">
                {error?.message || 'Course not found or failed to load.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full container mx-auto py-8">
      <div className="mx-auto space-y-6">
        {/* Course Header (Code-split into sections) */}
        <Suspense fallback={<CourseDetailSkeleton />}>
          <CourseGeneralInfo course={course} courseId={courseId} openModal={openModal} openHideForm={openHideForm} />
        </Suspense>

        <Suspense fallback={<CourseDetailSkeleton />}>
          <CourseTabs course={course} modules={modules} courseId={courseId} reviews={reviews} averageRating={averageRating} reviewsLoading={reviewsLoading} averageRatingLoading={averageRatingLoading} />
        </Suspense>

        {/* Course Public Check Modal */}
        <CoursePublicCheckModal
          isOpen={isOpen}
          isSubmitting={isSubmitting}
          isChecking={isChecking}
          checkResults={checkResults}
          checkError={checkError}
          submitError={submitError}
          onClose={closeModal}
          onPerformCheck={performCheck}
          onSubmitPublication={submitPublication}
        />

        {/* Course Hide Form */}
        <CourseHideForm
          isOpen={isHideFormOpen}
          isSubmitting={isHiding}
          form={hideForm}
          onClose={closeHideForm}
          onSubmit={onHideSubmit}
        />
      </div>
    </div>
  )
}

// StudentsList function removed as it has been moved to sections/tabs/students.tsx

function CourseDetailSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Course Header Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              <Skeleton className="w-32 h-24 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" disabled>Overview</TabsTrigger>
            <TabsTrigger value="content" disabled>Content</TabsTrigger>
            <TabsTrigger value="reviews" disabled>Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="w-full max-w-xs h-32 rounded-lg" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
