import ChoicesQuestion from "./choices"
import TrueFalseQuestion from "./true-false"
import ShortAnswerQuestion from "./short-answer"
import { type QuizQuestion, QuestionType } from "@/types/db/course/quiz-question"
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
    switch (question.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.SINGLE_CHOICE:
        return (
          <ChoicesQuestion
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )
      case QuestionType.TRUE_FALSE:
        return (
          <TrueFalseQuestion
            question={question}
            answer={answer}
            onAnswerChange={onAnswerChange}
            disabled={disabled}
          />
        )
      case QuestionType.SHORT_ANSWER:
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
        {question.questionType === QuestionType.MULTIPLE_CHOICE && (
          <p className="text-sm text-muted-foreground">
            Select all that apply
          </p>
        )}
      </div>
      {renderQuestion()}
    </div>
  )
}
