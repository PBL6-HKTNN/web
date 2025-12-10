import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverviewTab from './overview'
import CurriculumTab from './curriculums'
import InstructorTab from './instructor'
import ReviewTab from './review'
import { LayoutDashboard, BookOpen, MessageSquare, Users } from 'lucide-react'

import type { Course } from '@/types/db/course'
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
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="size-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="curriculum" className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span className="hidden sm:inline">Curriculum</span>
        </TabsTrigger>
        <TabsTrigger value="instructor" className="flex items-center gap-2">
          <Users className="size-4" />
          <span className="hidden sm:inline">Instructor</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <MessageSquare className="size-4" />
          <span className="hidden sm:inline">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
          <OverviewTab course={course} />
      </TabsContent>

      <TabsContent value="curriculum" className="mt-6">
          <CurriculumTab modules={modules} />
      </TabsContent>

      <TabsContent value="instructor" className="mt-6">
          <InstructorTab instructorId={course.instructorId} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
          <ReviewTab courseId={courseId} instructorId={course.instructorId} reviews={reviews} averageRating={averageRating} isLoading={reviewsLoading || averageRatingLoading} />
      </TabsContent>
    </Tabs>
  )
}
