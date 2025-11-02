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
    onAnswerChange({ selectedAnswerIds: [answerId] })
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
            key={ans.id}
            className={`cursor-pointer transition-colors ${
              selectedId === ans.id ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <RadioGroupItem value={ans.id} id={ans.id} />
                <Label
                  htmlFor={ans.id}
                  className="flex-1 cursor-pointer text-lg font-medium"
                >
                  {ans.text}
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RadioGroup>
  )
}
