import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./overview";
import CurriculumTab from "./curriculums";
import InstructorTab from "./instructor";
import ReviewTab from "./review";
import { LayoutDashboard, BookOpen, MessageSquare, Users } from "lucide-react";

import type { Course } from "@/types/db/course";
import type { Module } from "@/types/db/course/module";
import type { Review } from "@/types/db/review";

interface CourseTabsProps {
  course: Course;
  modules: Module[];
  courseId: string;
  reviews: Review[];
  averageRating: number;
  reviewsLoading: boolean;
  averageRatingLoading: boolean;
}

export default function CourseTabs({
  course,
  modules,
  courseId,
  reviews,
  averageRating,
  reviewsLoading,
  averageRatingLoading,
}: CourseTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="inline-flex h-14 items-center justify-start rounded-none border-b bg-transparent p-0 w-full gap-8">
        <TabsTrigger
          value="overview"
          className="inline-flex items-center justify-center whitespace-nowrap py-4 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent px-0 gap-2"
        >
          <LayoutDashboard className="size-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="curriculum"
          className="inline-flex items-center justify-center whitespace-nowrap py-4 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent px-0 gap-2"
        >
          <BookOpen className="size-4" />
          <span>Curriculum</span>
        </TabsTrigger>
        <TabsTrigger
          value="instructor"
          className="inline-flex items-center justify-center whitespace-nowrap py-4 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent px-0 gap-2"
        >
          <Users className="size-4" />
          <span>Instructor</span>
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="inline-flex items-center justify-center whitespace-nowrap py-4 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent px-0 gap-2"
        >
          <MessageSquare className="size-4" />
          <span>Reviews</span>
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
        <ReviewTab
          courseId={courseId}
          instructorId={course.instructorId}
          reviews={reviews}
          averageRating={averageRating}
          isLoading={reviewsLoading || averageRatingLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
