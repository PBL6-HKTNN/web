"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Check } from "lucide-react";

interface ChoiceQuestionFormProps {
  answers: Array<{ answerText: string; isCorrect: boolean }>;
  newAnswerText: string;
  setNewAnswerText: (text: string) => void;
  onAddAnswer: () => void;
  onToggleCorrect: (index: number) => void;
  onDeleteAnswer: (index: number) => void;
  canAddAnswer: boolean;
  isSingleChoice: boolean;
  isMultipleChoice: boolean;
}

export function ChoiceQuestionForm({
  answers,
  newAnswerText,
  setNewAnswerText,
  onAddAnswer,
  onToggleCorrect,
  onDeleteAnswer,
  canAddAnswer,
  isSingleChoice,
  isMultipleChoice,
}: ChoiceQuestionFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddAnswer();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Answers</Label>
      
      <div className="space-y-2">
        {answers && answers.length > 0 ? (
          answers.map((answer, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md border bg-background"
            >
              <Checkbox
                checked={answer.isCorrect}
                onCheckedChange={() => onToggleCorrect(index)}
              />
              <span className="flex-1">{answer.answerText}</span>
              {answer.isCorrect && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onDeleteAnswer(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No answers added yet</p>
        )}
      </div>

      {canAddAnswer && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter answer text"
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            type="button" 
            onClick={onAddAnswer} 
            disabled={!newAnswerText.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {isSingleChoice && "Maximum 4 answers. Select exactly 1 correct answer."}
        {isMultipleChoice && "Maximum 5 answers. Select at least 2 correct answers."}
      </p>
    </div>
  );
}
