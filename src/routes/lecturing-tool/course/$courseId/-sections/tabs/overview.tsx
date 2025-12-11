// JSX runtime handles React import automatically
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Course } from '@/types/db/course'
import { ImageIcon, Info, BarChart3, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCourseStatusBadgeProps } from '@/utils/render-utils'

interface OverviewTabProps {
  course: Course
}

export default function OverviewTab({ course }: OverviewTabProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Course Overview</CardTitle>
        <CardDescription>Get a quick overview of your course details and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {course.thumbnail && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" />
                  <h4 className="font-semibold">Course Thumbnail</h4>
                </div>
                <div className="rounded-lg border bg-muted/50 p-2">
                  <img
                    src={course.thumbnail}
                    alt={`${course.title} thumbnail`}
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-primary" />
                <h4 className="font-semibold">Course Information</h4>
              </div>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Title</span>
                  <span className="text-sm font-medium text-right">{course.title}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <span className="text-sm font-medium">{course.language}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <span className="text-sm font-medium">{course.level}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">${course.price}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {(() => {
                      const status = getCourseStatusBadgeProps(course.status);
                      return (
                        <Badge className={`px-2 py-0.5 font-medium ${status.className}`} title={status.label}>
                          {status.label}
                        </Badge>
                      );
                    })()}
                  </div>
                {course.isRequestedBanned && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Ban Request</span>
                      <Badge variant="destructive" className="flex items-center gap-2 px-2 py-0.5">
                        <AlertTriangle className="size-4" />
                        Requested
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                <h4 className="font-semibold">Course Statistics</h4>
              </div>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Modules</span>
                  <span className="text-sm font-medium">{course.numberOfModules}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{course.duration}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="text-sm font-medium">{course.numberOfReviews}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    {course.averageRating} <span className="text-yellow-500">★</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}
