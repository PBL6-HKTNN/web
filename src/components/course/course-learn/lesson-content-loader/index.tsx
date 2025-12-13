import { useCheckLessonLocked } from '@/hooks/queries/course/lesson-hooks';
import { useGetLessonsByModule } from '@/hooks/queries/course/module-hooks';
import ContentRender from '@/components/course/course-learn/content-render';
import { LessonProgressWrapper } from '@/components/course/course-learn/lesson-progress-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, LockIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCourseProgress } from '@/contexts/course/course-progress/hook'
import type { UUID } from '@/types';
import { LessonType } from '@/types/db/course/lesson';
import { parseTimespanToMinutes } from '@/utils/time-utils';

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

  // Enrollment data for current course
  

  const { getWatchedSecondsForCurrentView, getCurrentEnrollment, updateCurrentViewWithWatchedSeconds } = useCourseProgress()
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [resumeSeconds, setResumeSeconds] = useState<number | undefined>(undefined)

  useEffect(() => {
    const lessonLocal = lessonData?.data
    if (!lessonLocal || lessonLocal.lessonType !== LessonType.VIDEO) return
    const enrolledWatch = getWatchedSecondsForCurrentView()
    const currentEnrollment = getCurrentEnrollment()
    if (!enrolledWatch) return
    if (!currentEnrollment) return
    if (currentEnrollment.currentView !== lessonId) return

    setResumeSeconds(enrolledWatch)
    setShowResumeDialog(true)
  }, [lessonData, getWatchedSecondsForCurrentView, getCurrentEnrollment, courseId, lessonId, setResumeSeconds, setShowResumeDialog])

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
          <span>{parseTimespanToMinutes(lesson?.duration as string)} minutes</span>
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
        {!showResumeDialog && (
          <LessonProgressWrapper
            courseId={courseId}
            lessonId={lessonId}
            lessonType={lesson?.lessonType as LessonType}
          >
            <ContentRender lesson={lesson!} courseId={courseId} />
          </LessonProgressWrapper>
        )}
      </div>
      <Dialog open={showResumeDialog} onOpenChange={(open) => setShowResumeDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resume from last position</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            We detected that you left off at {resumeSeconds ? `${Math.floor(resumeSeconds / 60)}:${(resumeSeconds % 60).toString().padStart(2, '0')}` : ''}. Would you like to continue from that position?
          </DialogDescription>
          <DialogFooter className="mt-4">
            <div className="flex gap-2 justify-end w-full">
              <Button variant="secondary" onClick={() => { updateCurrentViewWithWatchedSeconds(courseId, lessonId, 0); setResumeSeconds(undefined); setShowResumeDialog(false) }}>Start from beginning</Button>
              <Button onClick={() => { setShowResumeDialog(false) }}>Resume from {resumeSeconds ? `${Math.floor(resumeSeconds / 60)}:${(resumeSeconds % 60).toString().padStart(2, '0')}` : ''}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}