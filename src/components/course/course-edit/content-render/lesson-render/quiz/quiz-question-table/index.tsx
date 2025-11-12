"use client";

import { useState } from "react";
import type { UseFormReturn, UseFieldArrayUpdate } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Edit, Trash2 } from "lucide-react";
import { QuestionType } from "@/types/db/course/quiz-question";
import { QuizQuestionEditForm } from "./edit-form";

interface QuizQuestionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: UseFieldArrayUpdate<any, "questions">;
  onRemove: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function QuizQuestionTable({
  questions,
  onUpdate,
  onRemove,
  form,
}: QuizQuestionTableProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getQuestionTypeBadge = (type: number) => {
    switch (type) {
      case QuestionType.SINGLE_CHOICE:
        return <Badge variant="secondary">Single Choice</Badge>;
      case QuestionType.MULTIPLE_CHOICE:
        return <Badge variant="default">Multiple Choice</Badge>;
      case QuestionType.TRUE_FALSE:
        return <Badge variant="outline">True/False</Badge>;
      case QuestionType.SHORT_ANSWER:
        return <Badge>Short Answer</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No questions added yet. Click the buttons above to add questions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-24">Marks</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <>
              <TableRow key={question.id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {question.questionText || <span className="text-muted-foreground italic">No question text</span>}
                </TableCell>
                <TableCell>{getQuestionTypeBadge(question.questionType)}</TableCell>
                <TableCell>{question.marks}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedIndex === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {expandedIndex === index && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-muted/50">
                    <QuizQuestionEditForm
                      questionIndex={index}
                      question={question}
                      onUpdate={onUpdate}
                      form={form}
                      onClose={() => setExpandedIndex(null)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
