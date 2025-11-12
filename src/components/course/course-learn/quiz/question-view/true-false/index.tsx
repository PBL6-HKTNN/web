import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { QuizQuestion } from "@/types/db/course/quiz-question"
import type { UserAnswer } from "@/contexts/course/course-quiz-learning"

type TrueFalseQuestionProps = {
  question: QuizQuestion
  answer?: UserAnswer
  onAnswerChange: (answer: Omit<UserAnswer, 'questionId'>) => void
  disabled?: boolean
}

export default function TrueFalseQuestion({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}: TrueFalseQuestionProps) {
  const selectedId = answer?.selectedAnswerIds?.[0] || ''

  const handleChange = (answerId: string) => {
    const selectedAnswer = question.answers.find(ans => ans.answerId === answerId)
    onAnswerChange({ 
      selectedAnswerIds: [answerId],
      answerText: selectedAnswer?.answerText || ''
    })
  }

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <div className="space-y-3">
        {question.answers.map((ans) => (
          <Card
            key={ans.answerId}
            className={`cursor-pointer transition-colors ${
              selectedId === ans.answerId ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value={ans.answerId!} id={ans.answerId} />
                <Label
                  htmlFor={ans.answerId}
                  className="flex-1 cursor-pointer text-lg font-medium"
                >
                  {ans.answerText}
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RadioGroup>
  )
}
