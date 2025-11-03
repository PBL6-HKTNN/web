import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { QuizQuestion } from "@/types/db/course/quiz-question"
import type { UserAnswer } from "@/contexts/course/course-quiz-learning"

type ShortAnswerQuestionProps = {
  question: QuizQuestion
  answer?: UserAnswer
  onAnswerChange: (answer: Omit<UserAnswer, 'questionId'>) => void
  disabled?: boolean
}

export default function ShortAnswerQuestion({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}: ShortAnswerQuestionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAnswerChange({ textAnswer: e.target.value })
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="short-answer" className="text-base">
        Your Answer
      </Label>
      <Textarea
        id="short-answer"
        placeholder="Type your answer here..."
        value={answer?.textAnswer || ''}
        onChange={handleChange}
        disabled={disabled}
        rows={4}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Worth {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
      </p>
    </div>
  )
}
