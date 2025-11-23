"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Save, Plus } from "lucide-react";
import { useQuizLessonRender } from "./hook";
import { QuestionType } from "@/types/db/course/quiz-question";
import { QuizQuestionTable } from "./quiz-question-table";
import type { Lesson } from "@/types/db/course/lesson";

interface QuizLessonRenderProps {
  lesson: Lesson;
}

export function QuizLessonRender({ lesson }: QuizLessonRenderProps) {
  const {
    // Data
    isLoading,
    isSaving,
    totalMarks,

    // Form
    form,
    fields,

    // Actions
    handleSave,
    addQuestion,
    updateQuestion,
    removeQuestion,
    cloneQuestion,
  } = useQuizLessonRender({ lesson });

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSave} className="h-full flex flex-col gap-4 overflow-y-auto">
      {/* General Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <CardTitle>Quiz Information</CardTitle>
            </div>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Quiz"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter quiz title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingMarks">
              Passing Marks * 
              <span className="text-sm text-muted-foreground font-normal">
                (Total: {totalMarks} marks)
              </span>
            </Label>
            <Input
              id="passingMarks"
              type="number"
              {...form.register("passingMarks", { valueAsNumber: true })}
              placeholder="Enter passing marks"
              // max={totalMarks}
            />
            {form.formState.errors.passingMarks && (
              <p className="text-sm text-destructive">{form.formState.errors.passingMarks.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Card */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addQuestion(QuestionType.SINGLE_CHOICE)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Single Choice
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addQuestion(QuestionType.MULTIPLE_CHOICE)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Multiple Choice
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addQuestion(QuestionType.TRUE_FALSE)}
              >
                <Plus className="h-4 w-4 mr-2" />
                True/False
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addQuestion(QuestionType.SHORT_ANSWER)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Short Answer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {form.formState.errors.questions && (
            <p className="text-sm text-destructive mb-4">{form.formState.errors.questions.message}</p>
          )}
          <QuizQuestionTable
            questions={fields}
            onUpdate={updateQuestion}
            onRemove={removeQuestion}
            onClone={cloneQuestion}
            form={form}
          />
        </CardContent>
      </Card>
    </form>
  );
}
