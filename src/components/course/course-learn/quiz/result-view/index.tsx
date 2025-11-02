import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Award, Clock } from "lucide-react"
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
    <div className="space-y-6">
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Correct</span>
                </div>
                <div className="text-2xl font-bold text-green-500">
                  {result.correctAnswers}
                </div>
                <div className="text-xs text-muted-foreground">
                  out of {result.totalQuestions}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">Incorrect</span>
                </div>
                <div className="text-2xl font-bold text-red-500">
                  {result.totalQuestions - result.correctAnswers}
                </div>
                <div className="text-xs text-muted-foreground">
                  out of {result.totalQuestions}
                </div>
              </CardContent>
            </Card>
          </div>

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

          {/* Achievement Badge */}
          {result.passed && (
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/50">
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <div className="font-semibold">Achievement Unlocked!</div>
                  <div className="text-sm text-muted-foreground">
                    You've passed this quiz with {result.percentage.toFixed(0)}%
                  </div>
                </div>
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

      {/* Pass Status Badge */}
      <div className="flex justify-center">
        <Badge
          variant={result.passed ? "default" : "destructive"}
          className="text-sm px-4 py-2"
        >
        {
            result.passed ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
            )
        }
          {result.passed ? "Passed" : "Not Passed"}
        </Badge>
      </div>
    </div>
  )
}
