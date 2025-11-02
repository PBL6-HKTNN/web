import ChoicesQuestion from "./choices"
import TrueFalseQuestion from "./true-false"
import ShortAnswerQuestion from "./short-answer"
import type { QuizQuestion } from "@/types/db/course/quiz-question"
import type { UserAnswer } from "@/contexts/course/course-quiz-learning"

type QuestionViewProps = {
  question: QuizQuestion
  answer?: UserAnswer
  onAnswerChange: (answer: Omit<UserAnswer, 'questionId'>) => void
  disabled?: boolean
}

export default function QuestionView({
  question,
  answer,
  onAnswerChange,
  disabled = false,
}: QuestionViewProps) {
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
      case 'single_choice':
        return (
          <ChoicesQuestion
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )
      case 'true_false':
        return (
          <TrueFalseQuestion
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )
      case 'short_answer':
        return (
          <ShortAnswerQuestion
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Question type not supported
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-relaxed">
          {question.questionText}
        </h3>
        {question.type === 'multiple_choice' && (
          <p className="text-sm text-muted-foreground">
            Select all that apply
          </p>
        )}
      </div>
      {renderQuestion()}
    </div>
  )
}
