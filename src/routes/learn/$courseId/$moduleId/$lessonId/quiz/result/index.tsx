import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCourseQuizLearning } from '@/contexts/course/course-quiz-learning'
import ResultView from '@/components/course/course-learn/quiz/result-view'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute(
  '/learn/$courseId/$moduleId/$lessonId/quiz/result/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { quizResult, resetQuiz } = useCourseQuizLearning()

  if (!quizResult) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Results Available</h2>
          <p className="text-muted-foreground mb-6">
            You need to complete the quiz first to see results.
          </p>
          <Button onClick={() => navigate({ to: "/course" })}>
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const handleRetry = () => {
    resetQuiz()
    navigate({ to: '..', replace: true })
  }

  return (
    <div className="min-h-screen flex items-center container max-w-3xl mx-auto py-8 px-4">
      <ResultView result={quizResult} onRetry={handleRetry} />
    </div>
  )
}

