import { useCheckLessonLocked } from '@/hooks/queries/course/lesson-hooks';
import { useGetLessonsByModule } from '@/hooks/queries/course/module-hooks';
import ContentRender from '@/components/course/course-learn/content-render';
import { LessonProgressWrapper } from '@/components/course/course-learn/lesson-progress-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, LockIcon } from 'lucide-react';
import type { UUID } from '@/types';
import type { LessonType } from '@/types/db/course/lesson';

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

  if (!lessonData?.data && (lessonData?.error as { message: string })?.message === "Lesson is Locked") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-8">

          <LockIcon className="w-16 h-16 text-destructive mx-auto mb-6" />

          <h2 className="text-2xl font-bold text-foreground mb-3">Lesson Locked</h2>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            Complete the previous lesson to unlock this content and continue your learning journey.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-left">
                Finish the lesson before this one to proceed
              </span>
            </div>
          </div>


          <div className="text-xs text-muted-foreground mt-4">
            <p>Need help? Contact your instructor or check the course syllabus.</p>
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
            Failed to load lesson content. {lessonError instanceof Error ? lessonError.message : ''}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const lesson = lessonData?.data;

  return (
    <div className="p-6 min-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson?.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">
            {lesson?.lessonType === 0 ? 'Markdown' : 
             lesson?.lessonType === 1 ? 'Video' : 
             lesson?.lessonType === 2 ? 'Quiz' : 'Unknown'}
          </span>
          <span>•</span>
          <span>{lesson?.duration} minutes</span>
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
          lessonType={lesson?.lessonType as LessonType}
        >
          <ContentRender lesson={lesson!} courseId={courseId} />
        </LessonProgressWrapper>
      </div>
    </div>
  );
}