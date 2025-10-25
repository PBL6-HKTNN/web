"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Trash2 } from "lucide-react";
import type { QuizQuestionReq } from "@/types/db/course/quiz-question";
import { QuestionType } from "@/types/db/course/quiz-question";
import { ChoiceQuestion } from "./choice";
import { TrueFalseQuestion } from "./true-false";
import { ShortAnswerQuestion } from "./short-answer";
import { useCourseEdit } from "@/contexts/course/course-edit";

interface QuizQuestionProps {
  question: QuizQuestionReq;
  questionIndex: number;
}

export function QuizQuestion({ question, questionIndex }: QuizQuestionProps) {
  const [isEditing, setIsEditing] = useState(!question.questionText);
  const [questionText, setQuestionText] = useState(question.questionText || "");
  const [marks, setMarks] = useState(question.marks || 1);

  const { selectedModuleId, selectedLessonId, updateQuizQuestion, deleteQuizQuestion } = useCourseEdit();

  const handleSave = () => {
    if (selectedModuleId && selectedLessonId && question.id) {
      updateQuizQuestion(selectedModuleId, selectedLessonId, question.id, {
        questionText,
        marks,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setQuestionText(question.questionText || "");
    setMarks(question.marks || 1);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (selectedModuleId && selectedLessonId && question.id) {
      deleteQuizQuestion(selectedModuleId, selectedLessonId, question.id);
    }
  };

  const getQuestionTypeBadge = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
        return <Badge variant="secondary">Single Choice</Badge>;
      case QuestionType.MULTIPLE_CHOICE:
        return <Badge variant="secondary">Multiple Choice</Badge>;
      case QuestionType.TRUE_FALSE:
        return <Badge variant="secondary">True/False</Badge>;
      case QuestionType.SHORT_ANSWER:
        return <Badge variant="secondary">Short Answer</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Question {questionIndex + 1}</span>
            {getQuestionTypeBadge()}
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
              <Input
                id={`question-${questionIndex}`}
                placeholder="Enter your question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`marks-${questionIndex}`}>Marks</Label>
              <Input
                id={`marks-${questionIndex}`}
                type="number"
                min="1"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end gap-2">
              {question.questionText && (
                <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button size="sm" onClick={handleSave} disabled={!questionText}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{question.questionText}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Marks: {question.marks}
              </p>
            </div>
          </div>
        )}

        {/* Render question-type specific components */}
        {!isEditing && question.questionText && (
          <>
            {(question.type === QuestionType.SINGLE_CHOICE ||
              question.type === QuestionType.MULTIPLE_CHOICE) && (
              <ChoiceQuestion question={question} />
            )}

            {question.type === QuestionType.TRUE_FALSE && (
              <TrueFalseQuestion question={question} />
            )}

            {question.type === QuestionType.SHORT_ANSWER && (
              <ShortAnswerQuestion question={question} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
