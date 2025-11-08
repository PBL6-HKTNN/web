"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface ShortAnswerQuestionFormProps {
  answers: Array<{ answerText: string; isCorrect: boolean }>;
  newAnswerText: string;
  setNewAnswerText: (text: string) => void;
  onAddAnswer: () => void;
  onDeleteAnswer: (index: number) => void;
}

export function ShortAnswerQuestionForm({
  answers,
  newAnswerText,
  setNewAnswerText,
  onAddAnswer,
  onDeleteAnswer,
}: ShortAnswerQuestionFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddAnswer();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Expected Answers</Label>
      
      <div className="space-y-2">
        {answers && answers.length > 0 ? (
          answers.map((answer, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md border bg-background"
            >
              <span className="flex-1">{answer.answerText}</span>
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
          <p className="text-sm text-muted-foreground">No expected answers added yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter expected answer"
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

      <p className="text-xs text-muted-foreground">
        Add expected answers. Students' answers will be matched against these.
      </p>
    </div>
  );
}
