import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { QuizQuestion } from "@/types/db/course/quiz-question"
import type { UserAnswer } from "@/contexts/course/course-quiz-learning"

type ChoicesQuestionProps = {
  question: QuizQuestion
  answer?: UserAnswer
  onAnswerChange: (answer: Omit<UserAnswer, 'questionId'>) => void
  disabled?: boolean
}

export default function ChoicesQuestion({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}: ChoicesQuestionProps) {
  const isMultipleChoice = question.type === 'multiple_choice'
  const selectedIds = answer?.selectedAnswerIds || []

  const handleSingleChoiceChange = (answerId: string) => {
    onAnswerChange({ selectedAnswerIds: [answerId] })
  }

  const handleMultipleChoiceChange = (answerId: string, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, answerId]
      : selectedIds.filter(id => id !== answerId)
    
    onAnswerChange({ selectedAnswerIds: newSelectedIds })
  }

  if (isMultipleChoice) {
    return (
      <div className="space-y-3">
        {question.answers.map((ans) => (
          <Card
            key={ans.id}
            className={`cursor-pointer transition-colors ${
              selectedIds.includes(ans.id) ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={ans.id}
                  checked={selectedIds.includes(ans.id)}
                  onCheckedChange={(checked) =>
                    handleMultipleChoiceChange(ans.id, checked === true)
                  }
                  disabled={disabled}
                />
                <Label
                  htmlFor={ans.id}
                  className="flex-1 cursor-pointer leading-relaxed"
                >
                  {ans.text}
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Single choice
  return (
    <RadioGroup
      value={selectedIds[0] || ''}
      onValueChange={handleSingleChoiceChange}
      disabled={disabled}
    >
      <div className="space-y-3">
        {question.answers.map((ans) => (
          <Card
            key={ans.id}
            className={`cursor-pointer transition-colors ${
              selectedIds[0] === ans.id ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value={ans.id} id={ans.id} />
                <Label
                  htmlFor={ans.id}
                  className="flex-1 cursor-pointer leading-relaxed"
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
