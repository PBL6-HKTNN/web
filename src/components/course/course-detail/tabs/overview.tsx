import type { Course } from "@/types/db/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewProps {
  course: Course;
}

export default function OverviewTab({ course }: OverviewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-2xl font-black tracking-tight">
          About this course
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {course.description}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none bg-slate-50 dark:bg-slate-900 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Course Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span className="font-bold">Beginner to Advanced</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Language</span>
              <span className="font-bold">{course.language}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Students</span>
              <span className="font-bold">
                {course.totalEnrollments.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-slate-50 dark:bg-slate-900 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Complete all course modules and assignments to receive a verified
              certificate of completion.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
