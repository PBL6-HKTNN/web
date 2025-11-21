import { useCheckLessonLocked } from '@/hooks/queries/course/lesson-hooks';
import { useGetLessonsByModule } from '@/hooks/queries/course/module-hooks';
import ContentRender from '@/components/course/course-learn/content-render';
import { LessonProgressWrapper } from '@/components/course/course-learn/lesson-progress-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TriangleAlert } from 'lucide-react';
import type { UUID } from '@/types';

interface LessonContentLoaderProps {
  courseId: UUID;
  lessonId: UUID;
  moduleId: UUID;
}

export function LessonContentLoader({ 
  courseId,
  lessonId, 
  moduleId
}: LessonContentLoaderProps) {
  // Fetch the specific lesson content
  const {
    data: lessonData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useCheckLessonLocked(lessonId);

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

  if (!lessonData?.data || lessonData.data === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-destructive" />
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Lesson Not Found</h2>
          <p className="text-muted-foreground">The requested lesson could not render due to:</p>
          <div className="mt-4 space-y-2 text-left text-sm text-destructive">
            <ul className="list-disc list-inside">
              <li>The lesson does not exist.</li>
              <li>The lesson has been deleted.</li>
              <li>You didn't complete the previous lessons.</li>
            </ul>
          </div>
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
        <LessonProgressWrapper
          courseId={courseId}
          lessonId={lessonId}
          lessonType={lesson.lessonType}
        >
          <ContentRender lesson={lesson} courseId={courseId} />
        </LessonProgressWrapper>
      </div>
    </div>
  );
}