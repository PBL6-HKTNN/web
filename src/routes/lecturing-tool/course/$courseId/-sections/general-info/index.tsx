// No default React import required
import type { Course } from '@/types/db/course'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Globe, EyeOff, BookOpen, Clock, Users, Star, AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { parseTimespanToMinutes} from '@/utils/time-utils'
import { renderLevelLabel, getCourseStatusBadgeProps } from '@/utils/render-utils'
import { CourseStatus, type Level } from '@/types/db/course'

interface CourseGeneralInfoProps {
  course: Course;
  courseId: string;
  openModal: () => void;
  openHideForm: () => void;
}

export default function CourseGeneralInfo({ course, courseId, openModal, openHideForm }: CourseGeneralInfoProps) {
  return (
    <div className="relative group">
      {/* Decorative/banner using course thumbnail (full width) */}
      <div className="h-56 w-full relative bg-muted/30 overflow-hidden" aria-hidden="true">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={`${course.title} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted/50 to-background" />
        )}
        {/* Gradient overlays for depth and smoothness */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
      </div>

      <Card className="overflow-hidden -mt-16 relative z-10">
        <CardHeader className="relative pt-0 px-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* No small thumbnail: full-width banner is used */}
          
          <div className="flex-1 space-y-2 mt-2">
            <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      {/* status dot */}
                      <span
                        aria-hidden
                        className={`inline-block w-3 h-3 rounded-full ${getCourseStatusBadgeProps(course.status).dotClass}`}
                      />
                      <CardTitle className="text-3xl font-bold tracking-tight">{course.title}</CardTitle>
                    </div>
                <CardDescription className="text-base mt-2 line-clamp-2 max-w-2xl">
                  {course.description || 'No description provided.'}
                </CardDescription>
              </div>
              <div className="flex gap-2 shrink-0">
                {course.status === CourseStatus.DRAFT && (
                  <Button variant="outline" size="sm" onClick={openModal} className="flex items-center gap-2">
                    <Globe className="size-4" />
                    Publish
                  </Button>
                )}
                {course.status === CourseStatus.PUBLISHED && (
                  <Button variant="outline" size="sm" onClick={openHideForm} className="flex items-center gap-2">
                    <EyeOff className="size-4" />
                    Hide
                  </Button>
                )}
                <Button asChild size="sm">
                  <Link
                    to="/lecturing-tool/course/$courseId/editing"
                    params={{ courseId }}
                    className="flex items-center gap-2"
                  >
                    <Edit className="size-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
            
              <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="px-2 py-0.5">{renderLevelLabel(course.level as Level)}</Badge>
              <Badge variant="outline" className="px-2 py-0.5">{course.language}</Badge>
              <Badge variant="outline" className="px-2 py-0.5">${course.price}</Badge>
              {/* Course status + Ban requested */}
              {(() => {
                const status = getCourseStatusBadgeProps(course.status);
                return (
                  <Badge className={`px-2 py-0.5 font-medium ${status.className}`} title={status.label}>
                    {status.label}
                  </Badge>
                );
              })()}
              {(course.isRequestedBanned && course.status !== CourseStatus.ARCHIVED) && (
                <Badge variant="destructive" className="flex items-center gap-2 px-2 py-0.5">
                  <AlertTriangle className="size-4" />
                  Ban Requested
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t mt-4">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <BookOpen className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{course.numberOfModules}</p>
              <p className="text-xs text-muted-foreground mt-1">Modules</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Clock className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{parseTimespanToMinutes(course.duration)} minutes</p>
              <p className="text-xs text-muted-foreground mt-1">Duration</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{course.numberOfReviews}</p>
              <p className="text-xs text-muted-foreground mt-1">Reviews</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-600">
              <Star className="size-4 fill-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{course.averageRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
