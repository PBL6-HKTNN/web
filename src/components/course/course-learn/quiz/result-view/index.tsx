import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import type { QuizResult } from "@/contexts/course/course-quiz-learning"
import { useNavigate, useParams } from "@tanstack/react-router"

type ResultViewProps = {
  result: QuizResult
  onRetry?: () => void
}

export default function ResultView({ result, onRetry }: ResultViewProps) {
  const navigate = useNavigate()
  const {
    courseId,
    moduleId,
    lessonId,
  } = useParams({ from: "/learn/$courseId/$moduleId/$lessonId/quiz/result/" })
  const handleClose = () => {
    navigate({ to: "/learn/$courseId/$moduleId/$lessonId", replace: true, params: { courseId, moduleId, lessonId } })
  }

  return (
    <div className="w-full space-y-6">
      {/* Result Header */}
      <Card className={result.passed ? "border-green-500" : "border-red-500"}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {result.passed ? (
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Congratulations!" : "Keep Practicing!"}
          </CardTitle>
          <p className="text-muted-foreground">
            {result.passed
              ? "You've successfully passed this quiz."
              : "You didn't pass this time, but you can try again."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold">
              {result.score} / {result.maxScore}
            </div>
            <div className="text-sm text-muted-foreground">
              {result.percentage.toFixed(1)}% Score
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={result.percentage} className="h-3" />

          {/* Time taken (if available) */}
          {result.timeTaken && (
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Time Taken</span>
                </div>
                <span className="text-lg font-semibold">
                  {Math.floor(result.timeTaken / 60)}:
                  {(result.timeTaken % 60).toString().padStart(2, '0')}
                </span>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!result.passed && onRetry && (
              <Button onClick={onRetry} className="flex-1" variant="default">
                Try Again
              </Button>
            )}
            <Button
              onClick={handleClose}
              className="flex-1"
              variant={result.passed ? "default" : "outline"}
            >
              {result.passed ? "Continue Learning" : "Back to Lesson"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
