import { QuestionType } from "@/types/db/course/quiz-question";

interface QuestionAnswer {
  answerText: string;
  isCorrect: boolean;
}

interface QuestionValidation {
  questionType: QuestionType;
  answers: QuestionAnswer[];
}

export function validateQuestion({
  questionType,
  answers,
}: QuestionValidation): string | null {
  const correctCount = answers.filter((a) => a.isCorrect).length;

  if (questionType === QuestionType.SINGLE_CHOICE) {
    if (answers.length === 0) return "Add at least one answer";
    if (answers.length > 4) return "Maximum 4 answers allowed";
    if (correctCount !== 1) return "Select exactly 1 correct answer";
  }

  if (questionType === QuestionType.MULTIPLE_CHOICE) {
    if (answers.length === 0) return "Add at least one answer";
    if (answers.length > 5) return "Maximum 5 answers allowed";
    if (correctCount < 2) return "Select at least 2 correct answers";
  }

  if (questionType === QuestionType.TRUE_FALSE) {
    if (answers.length !== 2)
      return "Must have exactly 2 answers (True and False)";
    if (correctCount !== 1) return "Select exactly 1 correct answer";
  }

  if (questionType === QuestionType.SHORT_ANSWER) {
    if (answers.length < 1) return "Add at least 1 expected answer";
  }

  return null;
}

export function canAddAnswer(
  questionType: QuestionType,
  currentAnswerCount: number
): boolean {
  if (questionType === QuestionType.SINGLE_CHOICE)
    return currentAnswerCount < 4;
  if (questionType === QuestionType.MULTIPLE_CHOICE)
    return currentAnswerCount < 5;
  if (questionType === QuestionType.TRUE_FALSE) return currentAnswerCount < 2;
  return true; // Short answer has no limit
}

export function getQuestionTypeConstraints(questionType: QuestionType) {
  switch (questionType) {
    case QuestionType.SINGLE_CHOICE:
      return {
        maxAnswers: 4,
        minAnswers: 1,
        requiredCorrectCount: 1,
        description: "Maximum 4 answers. Select exactly 1 correct answer.",
      };
    case QuestionType.MULTIPLE_CHOICE:
      return {
        maxAnswers: 5,
        minAnswers: 1,
        requiredCorrectCount: 2,
        description: "Maximum 5 answers. Select at least 2 correct answers.",
      };
    case QuestionType.TRUE_FALSE:
      return {
        maxAnswers: 2,
        minAnswers: 2,
        requiredCorrectCount: 1,
        description: "Must have exactly 2 answers (True and False).",
      };
    case QuestionType.SHORT_ANSWER:
      return {
        maxAnswers: Infinity,
        minAnswers: 1,
        requiredCorrectCount: Infinity,
        description:
          "Add expected answers. Students' answers will be matched against these.",
      };
    default:
      return {
        maxAnswers: Infinity,
        minAnswers: 0,
        requiredCorrectCount: 0,
        description: "",
      };
  }
}
