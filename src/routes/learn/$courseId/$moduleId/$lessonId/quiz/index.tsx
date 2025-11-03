import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useCourseQuizLearning } from '@/contexts/course/course-quiz-learning'
import { useCourseLearn } from '@/contexts/course/course-learn'
import QuestionView from '@/components/course/course-learn/quiz/question-view'
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
})

function RouteComponent() {
  const { courseId, moduleId, lessonId } = useParams({
    from: '/learn/$courseId/$moduleId/$lessonId/quiz/',
  })
  const navigate = useNavigate()
  const { getLessonContent } = useCourseLearn()
  const {
    currentQuiz,
    currentQuestionIndex,
    startQuiz,
    setAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    getCurrentQuestion,
    getAnswerForQuestion,
    canGoNext,
    canGoPrevious,
  } = useCourseQuizLearning()

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  // Load quiz data
  useEffect(() => {
    const lesson = getLessonContent(courseId, moduleId, lessonId)
    if (lesson?.quiz) {
      startQuiz(lesson.quiz)
    }
  }, [courseId, moduleId, lessonId, getLessonContent, startQuiz])

  const currentQuestion = getCurrentQuestion()
  const currentAnswer = currentQuestion
    ? getAnswerForQuestion(currentQuestion.id)
    : undefined

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground mb-4">
            Unable to load quiz data
          </p>
          <Button onClick={() => navigate({ to: '..', replace: true })}>
            Back to Lesson
          </Button>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / currentQuiz.quizQuestions.length) * 100

  const handleSubmit = () => {
    submitQuiz()
    navigate({
      to: '/learn/$courseId/$moduleId/$lessonId/quiz/result',
      params: { courseId, moduleId, lessonId },
    })
  }

  const handleAnswerChange = (answer: Omit<typeof currentAnswer, 'questionId'>) => {
    if (currentQuestion) {
      setAnswer(currentQuestion.id, answer)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {currentQuiz.quizQuestions.length}
            </Badge>
            <Badge variant="outline">
              {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
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
              Passing Score: {currentQuiz.passingScore} / {currentQuiz.totalMarks}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <QuestionView
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={previousQuestion}
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
              <Button onClick={nextQuestion}>
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
              <span className="font-semibold">{currentQuiz.quizQuestions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">Questions Answered:</span>
              <span className="font-semibold">
                {currentQuiz.quizQuestions.filter((q) =>
                  getAnswerForQuestion(q.id)
                ).length}
              </span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

