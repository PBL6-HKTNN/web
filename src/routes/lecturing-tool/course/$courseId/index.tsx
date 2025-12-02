import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authGuard } from '@/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCourseDetailPage } from './-hook'
import ModuleAccordion from '@/components/course/module-accordion'
import { CoursePublicCheckModal } from '@/components/course/course-public-check'
import { useCoursePublicCheck } from '@/components/course/course-public-check/hook'
import { CourseHideForm } from '@/components/course/course-hide-form'
import { useCourseHideForm } from '@/components/course/course-hide-form/hook'
import { ReviewList } from '@/components/review'
import { useGetReviewsByCourse, useGetAverageRatingByCourse } from '@/hooks/queries/review-hooks'
import { Edit, Clock, BookOpen, Star, Users, Globe, EyeOff, MessageSquare, Info, FileText } from 'lucide-react'
import { timeDurationFormat } from '@/utils/time-utils'
import { renderLevelLabel } from '@/utils/render-utils'
import type { Level } from '@/types/db/course'

export const Route = createFileRoute('/lecturing-tool/course/$courseId/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const { course, modules, isLoading, error } = useCourseDetailPage(courseId)
  const { isOpen, isChecking, checkResults, openModal, closeModal, performCheck } =
    useCoursePublicCheck(courseId)
  const { isOpen: isHideFormOpen, isSubmitting: isHiding, form: hideForm, openModal: openHideForm, closeModal: closeHideForm, onSubmit: onHideSubmit } =
    useCourseHideForm(courseId)
  
  // Review hooks
  const { data: reviewsData, isLoading: reviewsLoading } = useGetReviewsByCourse(courseId)
  const { data: averageRatingData, isLoading: averageRatingLoading } = useGetAverageRatingByCourse(courseId)
  
  const reviews = reviewsData?.data || []
  const averageRating = averageRatingData?.data?.averageRating || 0

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

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
        {/* Course Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-6">
              {course.thumbnail && (
                <div className="flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={`${course.title} thumbnail`}
                    className="w-32 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description || 'No description provided.'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={openModal} className="flex items-center gap-2">
                  <Globe className="size-4" />
                  Publish
                </Button>
                <Button variant="outline" onClick={openHideForm} className="flex items-center gap-2">
                  <EyeOff className="size-4" />
                  Hide Course
                </Button>
                <Button asChild>
                  <Link
                    to="/lecturing-tool/course/$courseId/editing"
                    params={{ courseId }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="size-4" />
                    Edit Course
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  {course.numberOfModules} Modules
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  {timeDurationFormat(course.duration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  {course.numberOfReviews} Reviews
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-4 text-muted-foreground" />
                <span className="text-sm">
                  {course.averageRating.toFixed(1)} Rating
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {renderLevelLabel(course.level as Level)}
              </Badge>
              <Badge variant="outline">
                {course.language}
              </Badge>
              <Badge variant="outline">
                ${course.price}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Layout */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="size-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>
                  Get a quick overview of your course details and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {course.thumbnail && (
                      <div>
                        <h4 className="font-semibold mb-2">Course Thumbnail</h4>
                        <img
                          src={course.thumbnail}
                          alt={`${course.title} thumbnail`}
                          className="w-full max-w-xs h-32 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Course Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Title:</span>
                          <span>{course.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Language:</span>
                          <span>{course.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Level:</span>
                          <span>{renderLevelLabel(course.level as Level)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span>${course.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Course Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Modules:</span>
                          <span>{course.numberOfModules}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{timeDurationFormat(course.duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reviews:</span>
                          <span>{course.numberOfReviews}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span>{course.averageRating.toFixed(1)} ⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  Explore the modules and lessons in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                {modules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="size-12 mx-auto mb-4 opacity-50" />
                    <p>No modules found for this course.</p>
                  </div>
                ) : (
                  <div>
                    {modules.map((module) => (
                      <ModuleAccordion
                        key={module.id}
                        data={module}
                        defaultExpanded={false}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
                <CardDescription>
                  See what students are saying about this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewList
                  courseId={courseId}
                  reviews={reviews}
                  averageRating={averageRating}
                  isLoading={reviewsLoading || averageRatingLoading}
                  showForm={false}
                  formatNumber={formatNumber}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Course Public Check Modal */}
        <CoursePublicCheckModal
          isOpen={isOpen}
          isChecking={isChecking}
          checkResults={checkResults}
          onClose={closeModal}
          onPerformCheck={performCheck}
          onSubmitPublication={() => {
            // Handle course publication submission
            console.log('Course published successfully')
            closeModal()
          }}
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
          <TabsList className="grid w-full grid-cols-3">
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
