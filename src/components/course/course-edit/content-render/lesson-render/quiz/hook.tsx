import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useGetQuizByLessonId, useUpdateQuiz, useCreateQuiz } from "@/hooks/queries/course/quiz-hooks";
import { QuestionType } from "@/types/db/course/quiz-question";
import { quizFormSchema, type QuizFormData } from "./validators";
import type { Lesson } from "@/types/db/course/lesson";

interface UseQuizLessonRenderProps {
  lesson: Lesson;
}

export function useQuizLessonRender({ lesson }: UseQuizLessonRenderProps) {
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Fetch quiz data
  const { data: quizData, isLoading } = useGetQuizByLessonId(lesson.id);
  const quiz = quizData?.data;

  // Mutations
  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();

  // Form setup
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: quiz?.title || "",
      description: quiz?.description || "",
      passingMarks: quiz?.passingMarks || 0,
      questions: quiz?.questions || [],
    },
    values: quiz ? {
      title: quiz.title,
      description: quiz.description || "",
      passingMarks: quiz.passingMarks,
      questions: quiz.questions || [],
    } : undefined,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const handleSave = async (data: QuizFormData) => {
    try {
      setIsSaving(true);

      const quizPayload = {
        lessonId: lesson.id,
        title: data.title,
        description: data.description || "",
        passingMarks: data.passingMarks,
        questions: data.questions.map(q => ({
          questionId: q.questionId,
          questionText: q.questionText,
          questionType: q.questionType as QuestionType,
          marks: q.marks,
          answers: q.answers.map(a => ({
            answerId: a.answerId,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          })),
        })),
      };

      if (quiz?.id) {
        await updateQuizMutation.mutateAsync({
          quizId: quiz.id,
          data: quizPayload,
        });
        success("Quiz updated successfully");
      } else {
        await createQuizMutation.mutateAsync(quizPayload);
        success("Quiz created successfully");
      }
    } catch (err) {
      error("Failed to save quiz: " + String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const addQuestion = (type: number) => {
    const newQuestion: QuizFormData["questions"][0] = {
      questionText: "",
      questionType: type,
      marks: 1,
      answers: type === QuestionType.TRUE_FALSE
        ? [
            { answerText: "True", isCorrect: false },
            { answerText: "False", isCorrect: false },
          ]
        : [],
    };
    append(newQuestion);
  };

  // Calculate total marks
  const totalMarks = fields.reduce((sum, question) => sum + (question.marks || 0), 0);

  const cloneQuestion = (index: number) => {
    const questionToClone = fields[index];
    if (questionToClone) {
      const clonedQuestion = {
        ...questionToClone,
        questionText: `${questionToClone.questionText} (Copy)`,
        answers: questionToClone.answers?.map(answer => ({
          ...answer,
          answerId: undefined, // Remove ID so it creates a new answer
        })) || [],
        questionId: undefined, // Remove ID so it creates a new question
      };
      append(clonedQuestion);
    }
  };

  return {
    // Data
    quiz,
    isLoading,
    isSaving,
    totalMarks,

    // Form
    form,
    fields,

    // Actions
    handleSave: form.handleSubmit(handleSave),
    addQuestion,
    updateQuestion: update,
    removeQuestion: remove,
    cloneQuestion,
  };
}
