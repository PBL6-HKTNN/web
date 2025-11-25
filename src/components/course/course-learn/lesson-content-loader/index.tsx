import { useGetLessonById } from '@/hooks/queries/course/lesson-hooks';
import { useGetLessonsByModule } from '@/hooks/queries/course/module-hooks';
import ContentRender from '@/components/course/course-learn/content-render';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { UUID } from '@/types';

interface LessonContentLoaderProps {
  lessonId: UUID;
  moduleId: UUID;
}

export function LessonContentLoader({ 
  lessonId, 
  moduleId
}: LessonContentLoaderProps) {
  // Fetch the specific lesson content
  const {
    data: lessonData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useGetLessonById(lessonId);

  // Optionally fetch module lessons for navigation context
  const {
    data: moduleLessonsData,
    isLoading: moduleLessonsLoading,
  } = useGetLessonsByModule(moduleId);

  if (lessonLoading) {
    return (
      <div className="p-6 min-w-4xl mx-auto">
        <div className="mb-6 space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (lessonError) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load lesson content. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!lessonData?.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Lesson Not Found</h2>
          <p className="text-muted-foreground">The requested lesson could not be found.</p>
        </div>
      </div>
    );
  }

  const lesson = lessonData.data;

  return (
    <div className="p-6 min-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">
            {lesson.lessonType === 0 ? 'Markdown' : 
             lesson.lessonType === 1 ? 'Video' : 
             lesson.lessonType === 2 ? 'Quiz' : 'Unknown'}
          </span>
          <span>•</span>
          <span>{lesson.duration} minutes</span>
          {!moduleLessonsLoading && moduleLessonsData?.data && (
            <>
              <span>•</span>
              <span>
                Lesson {moduleLessonsData.data.findIndex(l => l.id === lessonId) + 1} of {moduleLessonsData.data.length}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="lg:flex lg:justify-center">
        <ContentRender lesson={lesson} />
      </div>
    </div>
  );
}