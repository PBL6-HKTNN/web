import { Play, Clock, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import type { EnrolledCourse } from "@/types/db/course/course";
import type { Course } from "@/types/db/course";

interface EnrolledCourseCardProps {
  enrolledCourse: EnrolledCourse;
}

export function EnrolledCourseCard({ enrolledCourse }: EnrolledCourseCardProps) {
  const navigate = useNavigate();
  const course = enrolledCourse.course;

  if (!course) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="flex">
        {/* Course Thumbnail */}
        <div className="w-48 h-32 flex-shrink-0 relative overflow-hidden rounded-l-lg">
          <img
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Course Content */}
        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {course.title}
              </h3>

              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{enrolledCourse.completedLectures}/{enrolledCourse.totalLectures} lectures</span>
                </div>
                <Badge className={getStatusColor(enrolledCourse.status)}>
                  {enrolledCourse.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {enrolledCourse.progressPercentage}%
                  </span>
                </div>
                <Progress value={enrolledCourse.progressPercentage} className="h-2" />
              </div>

              {/* Instructor & Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">by</span>
                  <span className="text-sm font-medium">{(course as unknown as Course).instructorId || 'Unknown'}</span>
                </div>

                {enrolledCourse.certificateEarned && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Certificate earned</span>
                  </div>
                )}
              </div>

              {/* Last accessed */}
              {enrolledCourse.lastAccessedDate && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last accessed: {new Date(enrolledCourse.lastAccessedDate as string).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Continue Button */}
            <div className="ml-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ to: `/course/${course.id}` });
                }}
                className="whitespace-nowrap"
              >
                {enrolledCourse.status === 'completed' ? 'Review Course' : 'Continue Learning'}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
