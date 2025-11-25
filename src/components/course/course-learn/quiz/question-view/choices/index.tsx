import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { QuizQuestion } from "@/types/db/course/quiz-question"
import { QuestionType } from "@/types/db/course/quiz-question"
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
  const isMultipleChoice = question.questionType === QuestionType.MULTIPLE_CHOICE
  const selectedIds = answer?.selectedAnswerIds || []

  const handleSingleChoiceChange = (answerId: string) => {
    const selectedAnswer = question.answers.find(ans => ans.answerId === answerId)
    onAnswerChange({ 
      selectedAnswerIds: [answerId],
      answerText: selectedAnswer?.answerText || ''
    })
  }

  const handleMultipleChoiceChange = (answerId: string, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, answerId]
      : selectedIds.filter(id => id !== answerId)
    
    // For multiple choice, set answerText to comma-separated selected answer texts
    const selectedAnswers = question.answers.filter(ans => newSelectedIds.includes(ans.answerId!))
    const answerText = selectedAnswers.map(ans => ans.answerText).join(', ')
    
    onAnswerChange({ 
      selectedAnswerIds: newSelectedIds,
      answerText 
    })
  }

  if (isMultipleChoice) {
    return (
      <div className="space-y-3">
        {question.answers.map((ans) => (
          <Card
            key={ans.answerId}
            className={`cursor-pointer transition-colors ${
              selectedIds.includes(ans.answerId!) ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={ans.answerId}
                  checked={selectedIds.includes(ans.answerId!)}
                  onCheckedChange={(checked) =>
                    handleMultipleChoiceChange(ans.answerId!, checked === true)
                  }
                  disabled={disabled}
                />
                <Label
                  htmlFor={ans.answerId}
                  className="flex-1 cursor-pointer leading-relaxed"
                >
                  {ans.answerText}
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
            key={ans.answerId}
            className={`cursor-pointer transition-colors ${
              selectedIds[0] === ans.answerId ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <RadioGroupItem value={ans.answerId!} id={ans.answerId} />
                <Label
                  htmlFor={ans.answerId}
                  className="flex-1 cursor-pointer leading-relaxed"
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
