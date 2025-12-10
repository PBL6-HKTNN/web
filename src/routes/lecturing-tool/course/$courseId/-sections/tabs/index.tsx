// JSX runtime handles React import automatically
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import OverviewTab from './overview'
import ContentTab from './content'
import ReviewTab from './review'
import StudentsTab from './students'
import { Card, CardContent } from '@/components/ui/card'
import { LayoutDashboard, BookOpen, MessageSquare, Users } from 'lucide-react'

import type { Course } from '@/types/db/course'
import { CourseStatus } from '@/types/db/course'
import type { Module } from '@/types/db/course/module'
import type { Review } from '@/types/db/review'

interface CourseTabsProps {
  course: Course
  modules: Module[]
  courseId: string
  reviews: Review[]
  averageRating: number
  reviewsLoading: boolean
  averageRatingLoading: boolean
}

export default function CourseTabs({ course, modules, courseId, reviews, averageRating, reviewsLoading, averageRatingLoading }: CourseTabsProps) {
  const isPublished = course?.status === CourseStatus.PUBLISHED
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="size-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        {isPublished && (
          <>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <Card>
          <OverviewTab course={course} />
        </Card>
      </TabsContent>

      <TabsContent value="content" className="space-y-6 mt-6">
        <Card>
          <ContentTab modules={modules} />
        </Card>
      </TabsContent>

      <TabsContent value="reviews" className="space-y-6 mt-6">
        <Card>
          {isPublished ? (
            <ReviewTab courseId={courseId} reviews={reviews} averageRating={averageRating} isLoading={reviewsLoading || averageRatingLoading} />
          ) : (
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Reviews are not available for draft courses. Publish the course to enable reviews.</p>
            </CardContent>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="students" className="space-y-6 mt-6">
        <Card>
          {isPublished ? (
            <StudentsTab courseId={courseId} />
          ) : (
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Student list is not visible until the course is published.</p>
            </CardContent>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
