import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ModuleAccordion from "@/components/course/module-accordion";
import type { Module } from "@/types/db/course/module";
import type { UUID } from "@/types";

interface CourseContentSectionProps {
  modules: Module[];
  completedLessons: UUID[];
  onLessonSelect: (moduleId: string, lessonId: string) => void;
}

export function CourseContentSection({
  modules,
  completedLessons,
  onLessonSelect,
}: CourseContentSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Course Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="size-12 mx-auto mb-4 opacity-50" />
            <p>No modules found for this course.</p>
          </div>
        ) : (
          <div>
            {modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                data={module}
                onLessonSelect={onLessonSelect}
                defaultExpanded={false}
                completedLessons={completedLessons}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
