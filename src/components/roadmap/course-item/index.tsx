import { useNavigate } from '@tanstack/react-router'
import { useGetCourseById } from '@/hooks/queries/course/course-hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronUp, ChevronDown, X } from 'lucide-react'
import type { UUID } from '@/types'

interface CourseItemProps {
  courseId: UUID
  index: number
  totalCourses: number
  onRemove: (id: UUID) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isOwner: boolean
}

export function CourseItem({
  courseId,
  index,
  totalCourses,
  onRemove,
  onMoveUp,
  onMoveDown,
  isOwner,
}: CourseItemProps) {
  const { data: courseData, isLoading } = useGetCourseById(courseId)
  const course = courseData?.data
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-20 w-full" />
      </Card>
    )
  }

  if (!course) {
    return null
  }

  return (
    <Card className="group hover:shadow-md transition-shadow p-0">
      <CardContent className="p-0">
        <div className="flex">
          {/* Course Thumbnail */}
          <div
            className="w-48 h-32 flex-shrink-0 relative overflow-hidden rounded-l-lg cursor-pointer"
            onClick={() => navigate({ to: `/course/${course.id}` })}
          >
            <img
              src={course.thumbnail || '/placeholder-course.jpg'}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {course.price === 0 && (
              <Badge className="absolute top-2 right-2 bg-green-600">
                Free
              </Badge>
            )}
          </div>

          {/* Course Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start gap-4 h-full">
              {isOwner && (
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveUp()
                    }}
                    disabled={index === 0}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveDown()
                    }}
                    disabled={index === totalCourses - 1}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => navigate({ to: `/course/${course.id}` })}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {course.title}
                      </h4>
                    </div>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{course.language}</Badge>
                      {course.price > 0 ? (
                        <span>${course.price.toFixed(2)}</span>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </div>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(courseId)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

