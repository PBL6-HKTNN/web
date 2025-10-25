"use client";

import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { QuizQuestionReq } from "@/types/db/course/quiz-question";

interface ShortAnswerQuestionProps {
  question: QuizQuestionReq;
}

export function ShortAnswerQuestion({ question }: ShortAnswerQuestionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-4 rounded-md border bg-muted/50">
        <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium">Short Answer Question</p>
          <p className="text-xs text-muted-foreground">
            This question requires students to provide a written answer. It will be manually graded by the instructor.
          </p>
          <Badge variant="secondary" className="mt-2">
            Manual Grading Required
          </Badge>
        </div>
      </div>

      {question.answers && question.answers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Sample/Expected Answers:</p>
          <div className="space-y-1">
            {question.answers.map((answer) => (
              <div key={answer.id} className="p-2 rounded-md border bg-background">
                <p className="text-sm">{answer.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
