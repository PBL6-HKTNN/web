import { authGuard } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, BookOpen, Star, Loader2 } from 'lucide-react'
import { timeDurationFormat } from '@/utils/time-utils'
import { LearningNavBar } from '@/components/layout/nav-bar-2'
import ModuleAccordion from '@/components/course/module-accordion'
import { useCourseOverview } from './-hook'

export const Route = createFileRoute('/learn/$courseId/')({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function CourseOverview() {
  const { course, modules, totalLessons, isLoading, error, handleLessonSelect } = useCourseOverview()

  if (isLoading) {
    return (
      <>
        <LearningNavBar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !course) {
    return (
      <>
        <LearningNavBar />
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
              <p className="text-muted-foreground text-sm">
                The course you're looking for doesn't exist or you don't have access to it.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
  <>
    <LearningNavBar />
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
        {/* Course Header - Responsive */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row gap-6 p-6 lg:p-8">
                {/* Course Image */}
                <div className="flex-shrink-0">
                  <img
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.title}
                    className="w-full h-48 lg:w-48 lg:h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-2xl lg:text-3xl font-bold mb-2 break-words">
                        {course.title}
                      </h1>
                      <p className="text-muted-foreground text-sm lg:text-base mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="self-start">
                      {course.level}
                    </Badge>
                  </div>

                  {/* Course Stats - Responsive Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">
                        {course.duration ? timeDurationFormat(course.duration) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{course.numberOfReviews} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <span>{course.averageRating}</span>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${course.price}
                      </span>
                      <Badge variant="outline">{course.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Stats Cards - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {modules.length}
              </div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {totalLessons}
              </div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </CardContent>
          </Card>
          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {course.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Welcome to {course.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Start your learning journey by selecting a lesson from the sidebar.
              Each module contains multiple lessons that will help you master the concepts step by step.
            </p>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {modules.length} Modules
              </Badge>
              <Badge variant="outline">
                {totalLessons} Lessons
              </Badge>
              <Badge variant="outline">
                {course.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Content
            </CardTitle>
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
                    onLessonSelect={handleLessonSelect}
                    defaultExpanded={false}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </>
  )
}

function RouteComponent() {
  return (
      <CourseOverview />
  )
}
