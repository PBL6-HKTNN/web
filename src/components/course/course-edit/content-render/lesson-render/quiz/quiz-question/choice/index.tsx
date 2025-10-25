"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Check } from "lucide-react";
import type { QuizQuestionReq } from "@/types/db/course/quiz-question";
import { QuestionType } from "@/types/db/course/quiz-question";
import { useCourseEdit } from "@/contexts/course/course-edit";

interface ChoiceQuestionProps {
  question: QuizQuestionReq;
}

export function ChoiceQuestion({ question }: ChoiceQuestionProps) {
  const [newAnswerText, setNewAnswerText] = useState("");
  const { selectedModuleId, selectedLessonId, addAnswer, updateAnswer, deleteAnswer } = useCourseEdit();

  const isMultipleChoice = question.type === QuestionType.MULTIPLE_CHOICE;

  const handleAddAnswer = () => {
    if (newAnswerText && selectedModuleId && selectedLessonId && question.id) {
      addAnswer(selectedModuleId, selectedLessonId, question.id, {
        text: newAnswerText,
        isCorrect: false,
      });
      setNewAnswerText("");
    }
  };

  const handleToggleCorrect = (answerId: string, currentCorrect: boolean) => {
    if (selectedModuleId && selectedLessonId && question.id) {
      // For single choice, uncheck all other answers first
      if (!isMultipleChoice && !currentCorrect) {
        question.answers?.forEach((answer) => {
          if (answer.id !== answerId && answer.isCorrect) {
            updateAnswer(selectedModuleId, selectedLessonId, question.id!, answer.id!, {
              isCorrect: false,
            });
          }
        });
      }

      updateAnswer(selectedModuleId, selectedLessonId, question.id, answerId, {
        isCorrect: !currentCorrect,
      });
    }
  };

  const handleDeleteAnswer = (answerId: string) => {
    if (selectedModuleId && selectedLessonId && question.id) {
      deleteAnswer(selectedModuleId, selectedLessonId, question.id, answerId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Answers</Label>
        <div className="space-y-2">
          {question.answers && question.answers.length > 0 ? (
            question.answers.map((answer) => (
              <div
                key={answer.id}
                className="flex items-center gap-2 p-2 rounded-md border bg-background"
              >
                <Checkbox
                  checked={answer.isCorrect}
                  onCheckedChange={() => handleToggleCorrect(answer.id!, answer.isCorrect)}
                />
                <span className="flex-1">{answer.text}</span>
                {answer.isCorrect && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteAnswer(answer.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No answers added yet</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter answer text"
          value={newAnswerText}
          onChange={(e) => setNewAnswerText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddAnswer();
            }
          }}
        />
        <Button onClick={handleAddAnswer} disabled={!newAnswerText}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {isMultipleChoice
          ? "Check all correct answers. Students can select multiple options."
          : "Check the correct answer. Students can select only one option."}
      </p>
    </div>
  );
}
