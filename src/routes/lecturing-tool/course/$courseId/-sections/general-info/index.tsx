// No default React import required
import type { Course } from '@/types/db/course'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Globe, EyeOff, BookOpen, Clock, Users, Star } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { timeDurationFormat } from '@/utils/time-utils'
import { renderLevelLabel } from '@/utils/render-utils'
import { CourseStatus, type Level } from '@/types/db/course'

interface CourseGeneralInfoProps {
  course: Course;
  courseId: string;
  openModal: () => void;
  openHideForm: () => void;
}

export default function CourseGeneralInfo({ course, courseId, openModal, openHideForm }: CourseGeneralInfoProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
      </div>
      <CardHeader className="relative pt-0 -mt-12 px-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {course.thumbnail ? (
            <div className="flex-shrink-0 rounded-xl border-4 border-background shadow-sm overflow-hidden bg-background">
              <img
                src={course.thumbnail}
                alt={`${course.title} thumbnail`}
                className="w-40 h-28 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          ) : (
            <div className="w-40 h-28 rounded-xl border-4 border-background bg-muted flex items-center justify-center shadow-sm">
              <BookOpen className="size-10 text-muted-foreground/50" />
            </div>
          )}
          
          <div className="flex-1 space-y-2 mt-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight">{course.title}</CardTitle>
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
              <p className="text-sm font-medium leading-none">{timeDurationFormat(course.duration)}</p>
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
  );
}
