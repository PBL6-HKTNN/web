"use client";

import { useState } from "react";
import { QuestionType } from "@/types/db/course/quiz-question";
import type { UseFieldArrayUpdate, UseFormReturn } from "react-hook-form";
import { validateQuestion, canAddAnswer } from "./validators";

interface QuizQuestion {
  questionText: string;
  questionType: QuestionType;
  marks: number;
  answers: {
    answerText: string;
    isCorrect: boolean;
  }[];
}

interface UseQuizQuestionEditProps {
  questionIndex: number;
  question: QuizQuestion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: UseFieldArrayUpdate<any, "questions">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onClose: () => void;
}

export function useQuizQuestionEdit({
  questionIndex,
  question,
  onUpdate,
  onClose,
}: UseQuizQuestionEditProps) {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [newAnswerText, setNewAnswerText] = useState("");

  const questionType = localQuestion.questionType;
  const isSingleChoice = questionType === QuestionType.SINGLE_CHOICE;
  const isMultipleChoice = questionType === QuestionType.MULTIPLE_CHOICE;
  const isTrueFalse = questionType === QuestionType.TRUE_FALSE;
  const isShortAnswer = questionType === QuestionType.SHORT_ANSWER;

  const handleQuestionTextChange = (text: string) => {
    setLocalQuestion({ ...localQuestion, questionText: text });
  };

  const handleMarksChange = (marks: number) => {
    setLocalQuestion({ ...localQuestion, marks });
  };

  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return;

    const newAnswer = {
      answerText: newAnswerText,
      isCorrect: isShortAnswer, // Short answers are always correct
    };

    setLocalQuestion({
      ...localQuestion,
      answers: [...(localQuestion.answers || []), newAnswer],
    });
    setNewAnswerText("");
  };

  const handleToggleCorrect = (index: number) => {
    const answers = [...(localQuestion.answers || [])];

    if (isSingleChoice) {
      // For single choice, only one answer can be correct
      answers.forEach((a, i) => {
        answers[i] = { ...a, isCorrect: i === index };
      });
    } else if (isTrueFalse) {
      // For true/false, only one answer can be correct
      answers.forEach((a, i) => {
        answers[i] = { ...a, isCorrect: i === index };
      });
    } else {
      // For multiple choice and short answer, toggle the specific answer
      answers[index] = { ...answers[index], isCorrect: !answers[index].isCorrect };
    }

    setLocalQuestion({ ...localQuestion, answers });
  };

  const handleDeleteAnswer = (index: number) => {
    const answers = [...(localQuestion.answers || [])];
    answers.splice(index, 1);
    setLocalQuestion({ ...localQuestion, answers });
  };

  const handleSave = () => {
    onUpdate(questionIndex, localQuestion);
    onClose();
  };

  const canAddAnswerCheck = () => {
    const answerCount = localQuestion.answers?.length || 0;
    return canAddAnswer(questionType, answerCount);
  };

  const validationMessage = validateQuestion({
    questionType,
    answers: localQuestion.answers || [],
  });

  return {
    // State
    localQuestion,
    newAnswerText,
    setNewAnswerText,
    questionType,
    isSingleChoice,
    isMultipleChoice,
    isTrueFalse,
    isShortAnswer,
    validationMessage,
    
    // Actions
    handleQuestionTextChange,
    handleMarksChange,
    handleAddAnswer,
    handleToggleCorrect,
    handleDeleteAnswer,
    handleSave,
    canAddAnswer: canAddAnswerCheck,
  };
}
