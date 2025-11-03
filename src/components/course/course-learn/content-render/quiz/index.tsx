import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, Trophy, Play } from "lucide-react"
import type { Lesson } from "@/types/db/course/lesson"

type QuizContentProps = {
  lesson: Lesson
}

export default function QuizContent({ lesson }: QuizContentProps) {
  if (!lesson.quiz) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Quiz content is not available for this lesson.</p>
      </div>
    )
  }

  const quiz = lesson.quiz

  return (
    <div className="space-y-6">
      {/* Quiz Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" />
            {quiz.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{quiz.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-sm">Duration: {lesson.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-muted-foreground" />
              <span className="text-sm">Total Marks: {quiz.totalMarks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              <span className="text-sm">Passing Score: {quiz.passingScore}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {quiz.quizQuestions?.length || 0} Questions
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Previous Results Section (placeholder for future implementation) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Previous Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No previous quiz attempts found. Start your first attempt below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Start Quiz Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Button
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Play className="size-5 mr-2" />
              Start Quiz
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure you're ready before starting. You can only attempt the quiz once.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
