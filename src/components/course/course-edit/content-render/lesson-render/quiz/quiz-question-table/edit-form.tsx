"use client";

import type { UseFormReturn, UseFieldArrayUpdate } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuizQuestionEdit } from "./hook";
import { ChoiceQuestionForm, TrueFalseQuestionForm, ShortAnswerQuestionForm } from "./forms";

interface QuizQuestionEditFormProps {
  questionIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: UseFieldArrayUpdate<any, "questions">;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onClose: () => void;
}

export function QuizQuestionEditForm({
  questionIndex,
  question,
  onUpdate,
  form,
  onClose,
}: QuizQuestionEditFormProps) {
  const {
    // State
    localQuestion,
    newAnswerText,
    setNewAnswerText,
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
    canAddAnswer,
  } = useQuizQuestionEdit({
    questionIndex,
    question,
    onUpdate,
    form,
    onClose,
  });



  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`question-${questionIndex}-text`}>Question Text *</Label>
        <Input
          id={`question-${questionIndex}-text`}
          value={localQuestion.questionText}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
          placeholder="Enter question text"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`question-${questionIndex}-marks`}>Marks *</Label>
        <Input
          id={`question-${questionIndex}-marks`}
          type="number"
          value={localQuestion.marks}
          onChange={(e) => handleMarksChange(Number(e.target.value))}
          min={1}
        />
      </div>

      {/* Choice Questions Section */}
      {(isSingleChoice || isMultipleChoice) && (
        <ChoiceQuestionForm
          answers={localQuestion.answers || []}
          newAnswerText={newAnswerText}
          setNewAnswerText={setNewAnswerText}
          onAddAnswer={handleAddAnswer}
          onToggleCorrect={handleToggleCorrect}
          onDeleteAnswer={handleDeleteAnswer}
          canAddAnswer={canAddAnswer()}
          isSingleChoice={isSingleChoice}
          isMultipleChoice={isMultipleChoice}
        />
      )}

      {/* Short Answer Section */}
      {isShortAnswer && (
        <ShortAnswerQuestionForm
          answers={localQuestion.answers || []}
          newAnswerText={newAnswerText}
          setNewAnswerText={setNewAnswerText}
          onAddAnswer={handleAddAnswer}
          onDeleteAnswer={handleDeleteAnswer}
        />
      )}

      {/* True/False Section */}
      {isTrueFalse && (
        <TrueFalseQuestionForm
          answers={localQuestion.answers || []}
          onToggleCorrect={handleToggleCorrect}
        />
      )}

      {/* Validation Message */}
      {validationMessage && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {validationMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={!!validationMessage}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
