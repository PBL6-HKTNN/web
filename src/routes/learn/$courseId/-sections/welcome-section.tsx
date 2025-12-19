import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Course } from "@/types/db/course";

interface WelcomeSectionProps {
  course: Course;
  modulesCount: number;
  totalLessons: number;
}

export function WelcomeSection({
  course,
  modulesCount,
  totalLessons,
}: WelcomeSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Welcome to {course.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          You are enrolled in this course. Track your progress and access course
          materials below.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{modulesCount} Modules</Badge>
          <Badge variant="outline">{totalLessons} Lessons</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
