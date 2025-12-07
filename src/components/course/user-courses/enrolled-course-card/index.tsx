import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge'
import type { EnrolledCourseItem, EnrollmentStatus, EnrollmentProgressStatus } from "@/types/db/course/enrollment";

interface EnrolledCourseCardProps {
  course: EnrolledCourseItem & Partial<{ enrollmentStatus: EnrollmentStatus; progressStatus: EnrollmentProgressStatus }>;
}


export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="group cursor-pointer py-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="flex relative">
        {/* Course Thumbnail */}
        <div className="w-36 h-28 flex-shrink-0 relative overflow-hidden rounded-l-lg">
          <img
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Course Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between h-full">
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-200 leading-tight">
                {course.title}
              </h3>
              {/* Status badges */}
              <div className="mb-2 flex items-center gap-2">
                {course.enrollmentStatus !== undefined && (
                  <Badge className={`!px-2 !py-1 ${renderEnrollmentStatusBg(course.enrollmentStatus)}`}>{renderEnrollmentStatusLabel(course.enrollmentStatus)}</Badge>
                )}

                {course.progressStatus !== undefined && (
                  <Badge className={`!px-2 !py-1 ${renderProgressStatusBg(course.progressStatus)}`}>{renderProgressStatusLabel(course.progressStatus)}</Badge>
                )}
              </div>

              {course.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {course.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Instructor:</span>
                <span className="font-medium">{course.instructorId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 ml-6">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/learn/${course.id}` });
                }}
                className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  );
}

function renderEnrollmentStatusLabel(status?: EnrollmentStatus) {
  switch (status) {
    case 0:
      return 'Active'
    case 1:
      return 'Completed'
    case 2:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

function renderEnrollmentStatusBg(status?: EnrollmentStatus) {
  switch (status) {
    case 0:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 1:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 2:
      return 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive/60'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
  }
}

function renderProgressStatusLabel(status?: EnrollmentProgressStatus) {
  switch (status) {
    case 0:
      return 'Not started'
    case 1:
      return 'In progress'
    case 2:
      return 'Completed'
    default:
      return 'Unknown'
  }
}

function renderProgressStatusBg(status?: EnrollmentProgressStatus) {
  switch (status) {
    case 0:
      return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
    case 1:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 2:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
  }
}
