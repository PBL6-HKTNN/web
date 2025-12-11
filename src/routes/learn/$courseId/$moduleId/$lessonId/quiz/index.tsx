import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import QuestionView from '@/components/course/course-learn/quiz/question-view'
import { useCourseProgress } from '@/contexts/course/course-progress/hook'
import { useQuizDoingPage } from './-hook'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/quiz/',
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { quizId?: string } => {
    return {
      quizId: search.quizId as string,
    }
  },
})

function RouteComponent() {
  const {
    // Data
    currentQuiz,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    progress,
    
    // States
    isLoading,
    hasError,
    
    // Handlers
    handleSubmitQuiz,
    handleAnswerChange,
    handlePreviousQuestion,
    handleNextQuestion,
    handleBackToLesson,
    
    // Quiz navigation
    canGoNext,
    canGoPrevious,
    
    // Helper functions
    getAnswerForQuestion,
  } = useQuizDoingPage()

  const { courseId, lessonId } = useParams({ from: '/learn/$courseId/$moduleId/$lessonId/quiz/' })

  const { markQuizComplete } = useCourseProgress()
  const markedEmptyQuizRef = useRef(false)

  // Mark quizzes with no questions as complete (once) for enrollment progress
  useEffect(() => {
    if (!currentQuiz) return
    const hasNoQuestions = !currentQuiz.questions || currentQuiz.questions.length === 0
    if (hasNoQuestions && courseId && lessonId && !markedEmptyQuizRef.current) {
      markedEmptyQuizRef.current = true
      markQuizComplete(courseId, lessonId, true)
    }
  }, [currentQuiz, courseId, lessonId, markQuizComplete])

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (hasError || !currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground mb-4">
            Unable to load quiz data or invalid quiz parameters
          </p>
          <Button onClick={handleBackToLesson}>
            Back to Lesson
          </Button>
        </div>
      </div>
    )
  }

  // Check if quiz has no questions
  if (currentQuiz && (!currentQuiz.questions || currentQuiz.questions.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Has No Questions</h3>
          <p className="text-muted-foreground mb-4">
            This quiz doesn't have any questions yet. Please contact your instructor.
          </p>
          <Button onClick={handleBackToLesson}>
            Back to Lesson
          </Button>
        </div>
      </div>
    )
  }

  // Loading quiz questions
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions?.length || 0}
            </Badge>
            <Badge variant="outline">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <CardTitle className="text-2xl">{currentQuiz.title}</CardTitle>
          {currentQuiz.description && (
            <p className="text-muted-foreground">{currentQuiz.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
            <span>
              Passing Score: {currentQuiz.passingMarks} / {currentQuiz.totalMarks}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {currentQuestion && (
            <QuestionView
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={!canGoPrevious()}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentAnswer ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Answered
                </span>
              ) : (
                <span className="text-orange-600">Not answered yet</span>
              )}
            </div>

            {canGoNext() ? (
              <Button onClick={handleNextQuestion}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => setShowSubmitDialog(true)} variant="default">
                Submit Quiz
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your quiz? You won't be able to change
              your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Separator />
          <div className="py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-semibold">{currentQuiz.questions?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Questions Answered:</span>
              <span className="font-semibold">
                {currentQuiz.questions?.filter((q) =>
                  getAnswerForQuestion(q.questionId!)
                ).length || 0}
              </span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz}>
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

