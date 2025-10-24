"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { QuizQuestionReq } from "@/types/db/course/quiz-question";
import { useCourseEdit } from "@/contexts/course/course-edit";

interface TrueFalseQuestionProps {
  question: QuizQuestionReq;
}

export function TrueFalseQuestion({ question }: TrueFalseQuestionProps) {
  const { selectedModuleId, selectedLessonId, addAnswer, updateAnswer } = useCourseEdit();

  // Initialize True/False answers if they don't exist
  useEffect(() => {
    if (selectedModuleId && selectedLessonId && question.id) {
      if (!question.answers || question.answers.length === 0) {
        // Add True answer
        addAnswer(selectedModuleId, selectedLessonId, question.id, {
          text: "True",
          isCorrect: false,
        });
        // Add False answer
        addAnswer(selectedModuleId, selectedLessonId, question.id, {
          text: "False",
          isCorrect: false,
        });
      }
    }
  }, [selectedModuleId, selectedLessonId, question.id, question.answers, addAnswer]);

  const trueAnswer = question.answers?.find((a) => a.text === "True");
  const falseAnswer = question.answers?.find((a) => a.text === "False");

  const handleSetCorrect = (isTrue: boolean) => {
    if (selectedModuleId && selectedLessonId && question.id) {
      if (isTrue && trueAnswer) {
        updateAnswer(selectedModuleId, selectedLessonId, question.id, trueAnswer.id!, {
          isCorrect: true,
        });
        if (falseAnswer) {
          updateAnswer(selectedModuleId, selectedLessonId, question.id, falseAnswer.id!, {
            isCorrect: false,
          });
        }
      } else if (!isTrue && falseAnswer) {
        updateAnswer(selectedModuleId, selectedLessonId, question.id, falseAnswer.id!, {
          isCorrect: true,
        });
        if (trueAnswer) {
          updateAnswer(selectedModuleId, selectedLessonId, question.id, trueAnswer.id!, {
            isCorrect: false,
          });
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Correct Answer</p>
      <div className="flex gap-4">
        <Button
          variant={trueAnswer?.isCorrect ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleSetCorrect(true)}
        >
          {trueAnswer?.isCorrect && <Check className="h-4 w-4 mr-2" />}
          True
        </Button>
        <Button
          variant={falseAnswer?.isCorrect ? "default" : "outline"}
          className="flex-1"
          onClick={() => handleSetCorrect(false)}
        >
          {falseAnswer?.isCorrect && <X className="h-4 w-4 mr-2" />}
          False
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Select the correct answer for this True/False question
      </p>
    </div>
  );
}
