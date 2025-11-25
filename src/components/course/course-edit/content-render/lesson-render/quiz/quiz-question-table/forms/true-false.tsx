"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface TrueFalseQuestionFormProps {
  answers: Array<{ answerText: string; isCorrect: boolean }>;
  onToggleCorrect: (index: number) => void;
}

export function TrueFalseQuestionForm({
  answers,
  onToggleCorrect,
}: TrueFalseQuestionFormProps) {
  return (
    <div className="space-y-2">
      <Label>Correct Answer</Label>
      <div className="flex gap-4">
        {answers && answers.length === 2 ? (
          <>
            <Button
              type="button"
              variant={answers[0].isCorrect ? "default" : "outline"}
              className="flex-1"
              onClick={() => onToggleCorrect(0)}
            >
              {answers[0].isCorrect && <Check className="h-4 w-4 mr-2" />}
              True
            </Button>
            <Button
              type="button"
              variant={answers[1].isCorrect ? "default" : "outline"}
              className="flex-1"
              onClick={() => onToggleCorrect(1)}
            >
              {answers[1].isCorrect && <X className="h-4 w-4 mr-2" />}
              False
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            True/False answers will be automatically created
          </p>
        )}
      </div>
    </div>
  );
}
