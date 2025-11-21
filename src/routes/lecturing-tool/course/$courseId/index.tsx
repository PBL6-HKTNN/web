import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { authGuard } from '@/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCourseDetailPage } from './-hook'
import ModuleAccordion from '@/components/course/module-accordion'
import { CoursePublicCheckModal } from '@/components/course/course-public-check'
import { useCoursePublicCheck } from '@/components/course/course-public-check/hook'
import { CourseHideForm } from '@/components/course/course-hide-form'
import { useCourseHideForm } from '@/components/course/course-hide-form/hook'
import { Edit, Clock, BookOpen, Star, Users, Globe, EyeOff } from 'lucide-react'
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
            <div className="flex items-start justify-between">
              <div className="space-y-2">
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

        {/* Modules Section */}
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
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
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

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
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
      </div>
    </div>
  )
}
