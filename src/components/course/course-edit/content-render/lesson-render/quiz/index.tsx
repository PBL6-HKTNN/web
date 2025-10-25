"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LessonReq } from "@/types/db/course/lesson";
import { QuizQuestion } from "./quiz-question";
import { useCourseEdit } from "@/contexts/course/course-edit";
import { QuestionType } from "@/types/db/course/quiz-question";

interface QuizLessonRenderProps {
  lesson: LessonReq;
}

export function QuizLessonRender({ lesson }: QuizLessonRenderProps) {
  const { selectedModuleId, selectedLessonId, addQuizQuestion } = useCourseEdit();

  const handleAddQuestion = (type: typeof QuestionType[keyof typeof QuestionType]) => {
    if (selectedModuleId && selectedLessonId) {
      addQuizQuestion(selectedModuleId, selectedLessonId, {
        questionText: "",
        type,
        marks: 1,
        answers: [],
      });
    }
  };

  const quiz = lesson.quiz;

  return (
    <Card className="h-full flex flex-col overflow-y-auto">
      <CardHeader className="sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <CardTitle>Quiz Questions</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddQuestion(QuestionType.SINGLE_CHOICE)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Single Choice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddQuestion(QuestionType.MULTIPLE_CHOICE)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Multiple Choice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddQuestion(QuestionType.TRUE_FALSE)}
            >
              <Plus className="h-4 w-4 mr-2" />
              True/False
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddQuestion(QuestionType.SHORT_ANSWER)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Short Answer
            </Button>
          </div>
        </div>
        <CardDescription>
          Create and manage quiz questions for this lesson
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ScrollArea className="h-full pr-4">
          {quiz && quiz.quizQuestions && quiz.quizQuestions.length > 0 ? (
            <div className="space-y-4">
              {quiz.quizQuestions.map((question, index) => (
                <QuizQuestion
                  key={question.id || index}
                  question={question}
                  questionIndex={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No questions yet</p>
                <p className="text-xs mt-1">Add a question to get started</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
