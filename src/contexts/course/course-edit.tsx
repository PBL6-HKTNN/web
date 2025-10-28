import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { CourseEditReq } from "@/types/db/course";
import type { ModuleReq } from "@/types/db/course/module";
import type { LessonReq } from "@/types/db/course/lesson";
import type { QuizReq } from "@/types/db/course/quiz";
import type { QuizQuestionReq } from "@/types/db/course/quiz-question";
import type { Answer } from "@/types/db/course/answer";

// Pending change types
type PendingAddition = {
  id: string;
  type: 'module' | 'lesson' | 'quiz' | 'question' | 'answer';
  data: ModuleReq | LessonReq | QuizReq | QuizQuestionReq | Answer;
  parentIds?: {
    moduleId?: string;
    lessonId?: string;
    questionId?: string;
  };
};

type PendingEdit = {
  id: string;
  type: 'module' | 'lesson' | 'quiz' | 'question' | 'answer';
  originalId: string;
  data: Partial<ModuleReq | LessonReq | QuizReq | QuizQuestionReq | Answer>;
  parentIds?: {
    moduleId?: string;
    lessonId?: string;
    questionId?: string;
  };
};

type PendingDeletion = {
  id: string;
  type: 'module' | 'lesson' | 'quiz' | 'question' | 'answer';
  originalId: string;
  parentIds?: {
    moduleId?: string;
    lessonId?: string;
    questionId?: string;
  };
};

// Mock initial course edit data
const createMockCourseEdit = (): CourseEditReq => ({
  id: "course-1",
  modules: [
    {
      id: "module-1",
      title: "Getting Started",
      order: 1,
      lessons: [
        {
          id: "lesson-1",
          title: "What is React?",
          rawContent: "# What is React?\n\nReact is a JavaScript library for building user interfaces.",
          contentUrl: "",
          duration: 900,
          orderIndex: 1,
          isPreviewable: true,
          lessonType: "markdown",
          quiz: null,
        },
        {
          id: "lesson-2",
          title: "Setting up your environment",
          rawContent: "# Setting up your environment\n\nLet's install Node.js and create our first React app.",
          contentUrl: "",
          duration: 900,
          orderIndex: 2,
          isPreviewable: false,
          lessonType: "markdown",
          quiz: null,
        },
      ],
    },
  ],
});

interface CourseEditContextType {
  // Form state
  form: ReturnType<typeof useForm<CourseEditReq>>;
  isDirty: boolean;
  isSaving: boolean;

  // Selection state
  selectMode: 'module' | 'lesson' | null;
  selectedModuleId: string | null;
  selectedLessonId: string | null;
  setSelectMode: (mode: 'module' | 'lesson' | null) => void;
  setSelectedModule: (moduleId: string | null) => void;
  setSelectedLesson: (lessonId: string | null) => void;
  getSelectedModule: () => ModuleReq | null;
  getSelectedLesson: () => LessonReq | null;

  // Pending changes state
  pendingAdditions: PendingAddition[];
  pendingEdits: PendingEdit[];
  pendingDeletions: PendingDeletion[];

  // Module operations
  addModule: (module: Omit<ModuleReq, 'id'>) => void;
  updateModule: (moduleId: string, updates: Partial<Pick<ModuleReq, 'title' | 'order'>>) => void;
  deleteModule: (moduleId: string) => void;
  reorderModules: (moduleIds: string[]) => void;

  // Lesson operations
  addLesson: (moduleId: string, lesson: Omit<LessonReq, 'id'>) => void;
  updateLesson: (moduleId: string, lessonId: string, updates: Partial<LessonReq>) => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;
  reorderLessons: (moduleId: string, lessonIds: string[]) => void;

  // Quiz operations
  addQuiz: (moduleId: string, lessonId: string, quiz: QuizReq) => void;
  updateQuiz: (moduleId: string, lessonId: string, updates: Partial<QuizReq>) => void;
  deleteQuiz: (moduleId: string, lessonId: string) => void;

  // Quiz Question operations
  addQuizQuestion: (moduleId: string, lessonId: string, question: Omit<QuizQuestionReq, 'id'>) => void;
  updateQuizQuestion: (moduleId: string, lessonId: string, questionId: string, updates: Partial<QuizQuestionReq>) => void;
  deleteQuizQuestion: (moduleId: string, lessonId: string, questionId: string) => void;

  // Answer operations
  addAnswer: (moduleId: string, lessonId: string, questionId: string, answer: Omit<Answer, 'id'>) => void;
  updateAnswer: (moduleId: string, lessonId: string, questionId: string, answerId: string, updates: Partial<Answer>) => void;
  deleteAnswer: (moduleId: string, lessonId: string, questionId: string, answerId: string) => void;

  // Actions
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  reset: () => void;
  submitPendingChanges: () => Promise<void>;
  clearPendingChanges: () => void;

  // Delete modal state
  isDeleteModalOpen: boolean;
  deleteTarget: { type: 'module' | 'lesson'; moduleId: string; lessonId?: string } | null;
  openDeleteModal: (type: 'module' | 'lesson', moduleId: string, lessonId?: string) => void;
  closeDeleteModal: () => void;
  confirmDelete: () => void;
}

const CourseEditContext = createContext<CourseEditContextType | undefined>(undefined);

interface CourseEditProviderProps {
  children: ReactNode;
  initialCourseEdit?: CourseEditReq;
}

export function CourseEditProvider({
  children,
  initialCourseEdit = createMockCourseEdit()
}: CourseEditProviderProps) {
  const form = useForm<CourseEditReq>({
    defaultValues: initialCourseEdit,
  });

  const { setValue, getValues, reset, watch, formState: { isDirty } } = form;
  const watchedModules = watch('modules');
  const [isSaving, setIsSaving] = useState(false);
  const [originalCourseEdit] = useState<CourseEditReq>(initialCourseEdit);

  // Selection and pending changes state
  const [selectMode, setSelectModeState] = useState<'module' | 'lesson' | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [pendingAdditions, setPendingAdditions] = useState<PendingAddition[]>([]);
  const [pendingEdits, setPendingEdits] = useState<PendingEdit[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<PendingDeletion[]>([]);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'module' | 'lesson'; moduleId: string; lessonId?: string } | null>(null);

  // Utility functions
  const generateId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Selection methods
  const setSelectMode = useCallback((mode: 'module' | 'lesson' | null) => {
    setSelectModeState(mode);
    // Clear selections when changing mode
    if (mode !== 'module') {
      setSelectedModuleId(null);
    }
    if (mode !== 'lesson') {
      setSelectedLessonId(null);
    }
  }, []);

  const setSelectedModule = useCallback((moduleId: string | null) => {
    setSelectedModuleId(moduleId);
    setSelectModeState('module');
    // Clear lesson selection when selecting module
    setSelectedLessonId(null);
  }, []);

  const setSelectedLesson = useCallback((lessonId: string | null) => {
    setSelectedLessonId(lessonId);
    setSelectModeState('lesson');
    // Keep module selection - we need it to find the lesson
  }, []);

  const getSelectedModule = useCallback((): ModuleReq | null => {
    if (!selectedModuleId) return null;
    return watchedModules.find(m => m.id === selectedModuleId) || null;
  }, [selectedModuleId, watchedModules]);

  const getSelectedLesson = useCallback((): LessonReq | null => {
    if (!selectedLessonId || !selectedModuleId) return null;
    const module = watchedModules.find(m => m.id === selectedModuleId);
    if (!module) return null;
    return module.lessons.find(l => l.id === selectedLessonId) || null;
  }, [selectedLessonId, selectedModuleId, watchedModules]);

  // Pending changes management
  const addPendingAddition = useCallback((addition: Omit<PendingAddition, 'id'>) => {
    const newAddition: PendingAddition = {
      id: generateId(),
      ...addition,
    };
    setPendingAdditions(prev => [...prev, newAddition]);
  }, []);

  const addPendingEdit = useCallback((edit: Omit<PendingEdit, 'id'>) => {
    const newEdit: PendingEdit = {
      id: generateId(),
      ...edit,
    };
    setPendingEdits(prev => [...prev, newEdit]);
  }, []);

  const addPendingDeletion = useCallback((deletion: Omit<PendingDeletion, 'id'>) => {
    const newDeletion: PendingDeletion = {
      id: generateId(),
      ...deletion,
    };
    setPendingDeletions(prev => [...prev, newDeletion]);
  }, []);

  const clearPendingChanges = useCallback(() => {
    setPendingAdditions([]);
    setPendingEdits([]);
    setPendingDeletions([]);
  }, []);

  const submitPendingChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      // Mock API submission - replace with actual API calls
      console.log('Submitting pending changes:', {
        additions: pendingAdditions,
        edits: pendingEdits,
        deletions: pendingDeletions,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear pending changes after successful submission
      clearPendingChanges();
    } finally {
      setIsSaving(false);
    }
  }, [pendingAdditions, pendingEdits, pendingDeletions, clearPendingChanges]);

  // Module operations
  const addModule = useCallback((moduleData: Omit<ModuleReq, 'id'>) => {
    const currentModules = getValues('modules');
    const newModule: ModuleReq = {
      id: generateId(),
      title: moduleData.title,
      order: moduleData.order,
      lessons: moduleData.lessons,
    };

    setValue('modules', [...currentModules, newModule]);

    // Track pending addition
    addPendingAddition({
      type: 'module',
      data: newModule,
    });
  }, [getValues, setValue, addPendingAddition]);

  const updateModule = useCallback((moduleId: string, updates: Partial<Pick<ModuleReq, 'title' | 'order'>>) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? { ...module, ...updates }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending edit
    addPendingEdit({
      type: 'module',
      originalId: moduleId,
      data: updates,
    });
  }, [getValues, setValue, addPendingEdit]);

  const deleteModule = useCallback((moduleId: string) => {
    const currentModules = getValues('modules');
    const filteredModules = currentModules.filter(module => module.id !== moduleId);
    setValue('modules', filteredModules);

    // Track pending deletion
    addPendingDeletion({
      type: 'module',
      originalId: moduleId,
    });
  }, [getValues, setValue, addPendingDeletion]);

  const reorderModules = useCallback((moduleIds: string[]) => {
    const currentModules = getValues('modules');
    const reorderedModules = moduleIds.map((id, index) => {
      const module = currentModules.find(m => m.id === id);
      return module ? { ...module, order: index + 1 } : null;
    }).filter(Boolean) as ModuleReq[];
    setValue('modules', reorderedModules);
  }, [getValues, setValue]);

  // Lesson operations
  const addLesson = useCallback((moduleId: string, lessonData: Omit<LessonReq, 'id'>) => {
    const currentModules = getValues('modules');
    const newLesson: LessonReq = {
      id: generateId(),
      title: lessonData.title,
      rawContent: lessonData.rawContent,
      contentUrl: lessonData.contentUrl,
      duration: lessonData.duration,
      orderIndex: lessonData.orderIndex,
      isPreviewable: lessonData.isPreviewable,
      lessonType: lessonData.lessonType,
      quiz: lessonData.quiz,
    };

    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: [...module.lessons, newLesson],
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending addition
    addPendingAddition({
      type: 'lesson',
      data: newLesson,
      parentIds: { moduleId },
    });
  }, [getValues, setValue, addPendingAddition]);

  const updateLesson = useCallback((moduleId: string, lessonId: string, updates: Partial<LessonReq>) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson => {
              if (lesson.id === lessonId) {
                const updatedLesson = { ...lesson, ...updates };
                // Initialize quiz if lesson type is being set to "quiz" and quiz doesn't exist
                if (updates.lessonType === "quiz" && !updatedLesson.quiz) {
                  updatedLesson.quiz = {
                    title: lesson.title || "Quiz",
                    passingScore: 70,
                    totalMarks: 0,
                    quizQuestions: [],
                  };
                }
                return updatedLesson;
              }
              return lesson;
            }),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending edit
    addPendingEdit({
      type: 'lesson',
      originalId: lessonId,
      data: updates,
      parentIds: { moduleId },
    });
  }, [getValues, setValue, addPendingEdit]);

  const deleteLesson = useCallback((moduleId: string, lessonId: string) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.filter(lesson => lesson.id !== lessonId),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending deletion
    addPendingDeletion({
      type: 'lesson',
      originalId: lessonId,
      parentIds: { moduleId },
    });
  }, [getValues, setValue, addPendingDeletion]);

  const reorderLessons = useCallback((moduleId: string, lessonIds: string[]) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: lessonIds.map((id, index) => {
              const lesson = module.lessons.find(l => l.id === id);
              return lesson ? { ...lesson, orderIndex: index + 1 } : null;
            }).filter(Boolean) as LessonReq[],
          }
        : module
    );
    setValue('modules', updatedModules);
  }, [getValues, setValue]);

  // Quiz operations
  const addQuiz = useCallback((moduleId: string, lessonId: string, quizData: QuizReq) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId
                ? { ...lesson, quiz: quizData, lessonType: "quiz" as const }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending addition
    addPendingAddition({
      type: 'quiz',
      data: quizData,
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingAddition]);

  const updateQuiz = useCallback((moduleId: string, lessonId: string, updates: Partial<QuizReq>) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? { ...lesson, quiz: { ...lesson.quiz, ...updates } }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending edit
    addPendingEdit({
      type: 'quiz',
      originalId: lessonId, // Using lessonId as quiz identifier
      data: updates,
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingEdit]);

  const deleteQuiz = useCallback((moduleId: string, lessonId: string) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId
                ? { ...lesson, quiz: null, lessonType: "markdown" as const }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending deletion
    addPendingDeletion({
      type: 'quiz',
      originalId: lessonId, // Using lessonId as quiz identifier
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingDeletion]);

  // Quiz Question operations
  const addQuizQuestion = useCallback((moduleId: string, lessonId: string, questionData: Omit<QuizQuestionReq, 'id'>) => {
    const currentModules = getValues('modules');
    const newQuestion: QuizQuestionReq = {
      id: generateId(),
      ...questionData,
    };

    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: [...lesson.quiz.quizQuestions, newQuestion],
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending addition
    addPendingAddition({
      type: 'question',
      data: newQuestion,
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingAddition]);

  const updateQuizQuestion = useCallback((moduleId: string, lessonId: string, questionId: string, updates: Partial<QuizQuestionReq>) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: lesson.quiz.quizQuestions.map(question =>
                        question.id === questionId
                          ? { ...question, ...updates }
                          : question
                      ),
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending edit
    addPendingEdit({
      type: 'question',
      originalId: questionId,
      data: updates,
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingEdit]);

  const deleteQuizQuestion = useCallback((moduleId: string, lessonId: string, questionId: string) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: lesson.quiz.quizQuestions.filter(q => q.id !== questionId),
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending deletion
    addPendingDeletion({
      type: 'question',
      originalId: questionId,
      parentIds: { moduleId, lessonId },
    });
  }, [getValues, setValue, addPendingDeletion]);

  // Answer operations
  const addAnswer = useCallback((moduleId: string, lessonId: string, questionId: string, answerData: Omit<Answer, 'id'>) => {
    const currentModules = getValues('modules');
    const newAnswer: Answer = {
      id: generateId(),
      text: answerData.text,
      isCorrect: answerData.isCorrect,
    };

    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: lesson.quiz.quizQuestions.map(question =>
                        question.id === questionId
                          ? {
                              ...question,
                              answers: [...(question.answers || []), newAnswer],
                            }
                          : question
                      ),
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending addition
    addPendingAddition({
      type: 'answer',
      data: newAnswer,
      parentIds: { moduleId, lessonId, questionId },
    });
  }, [getValues, setValue, addPendingAddition]);

  const updateAnswer = useCallback((moduleId: string, lessonId: string, questionId: string, answerId: string, updates: Partial<Answer>) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: lesson.quiz.quizQuestions.map(question =>
                        question.id === questionId
                          ? {
                              ...question,
                              answers: question.answers?.map(answer =>
                                answer.id === answerId
                                  ? { ...answer, ...updates }
                                  : answer
                              ),
                            }
                          : question
                      ),
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending edit
    addPendingEdit({
      type: 'answer',
      originalId: answerId,
      data: updates,
      parentIds: { moduleId, lessonId, questionId },
    });
  }, [getValues, setValue, addPendingEdit]);

  const deleteAnswer = useCallback((moduleId: string, lessonId: string, questionId: string, answerId: string) => {
    const currentModules = getValues('modules');
    const updatedModules = currentModules.map(module =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && lesson.quiz
                ? {
                    ...lesson,
                    quiz: {
                      ...lesson.quiz,
                      quizQuestions: lesson.quiz.quizQuestions.map(question =>
                        question.id === questionId
                          ? {
                              ...question,
                              answers: question.answers?.filter(a => a.id !== answerId),
                            }
                          : question
                      ),
                    },
                  }
                : lesson
            ),
          }
        : module
    );
    setValue('modules', updatedModules);

    // Track pending deletion
    addPendingDeletion({
      type: 'answer',
      originalId: answerId,
      parentIds: { moduleId, lessonId, questionId },
    });
  }, [getValues, setValue, addPendingDeletion]);

  // Actions
  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Course changes saved:', getValues());
    } finally {
      setIsSaving(false);
    }
  }, [getValues]);

  const discardChanges = useCallback(() => {
    reset(originalCourseEdit);
  }, [reset, originalCourseEdit]);

  const resetForm = useCallback(() => {
    const newCourseEdit = createMockCourseEdit();
    reset(newCourseEdit);
  }, [reset]);

  // Delete modal functions
  const openDeleteModal = useCallback((type: 'module' | 'lesson', moduleId: string, lessonId?: string) => {
    setDeleteTarget({ type, moduleId, lessonId });
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'module') {
      deleteModule(deleteTarget.moduleId);
      setSelectedModule(null);
      setSelectMode(null);
    } else if (deleteTarget.type === 'lesson' && deleteTarget.lessonId) {
      deleteLesson(deleteTarget.moduleId, deleteTarget.lessonId);
      setSelectedLesson(null);
      setSelectMode('module');
    }

    closeDeleteModal();
  }, [deleteTarget, deleteModule, deleteLesson, setSelectedModule, setSelectedLesson, setSelectMode, closeDeleteModal]);

  const value: CourseEditContextType = {
    form,
    isDirty,
    isSaving,
    selectMode,
    selectedModuleId,
    selectedLessonId,
    setSelectMode,
    setSelectedModule,
    setSelectedLesson,
    getSelectedModule,
    getSelectedLesson,
    pendingAdditions,
    pendingEdits,
    pendingDeletions,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    addLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    addQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer,
    saveChanges,
    discardChanges,
    reset: resetForm,
    submitPendingChanges,
    clearPendingChanges,
    isDeleteModalOpen,
    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };

  return (
    <CourseEditContext.Provider value={value}>
      {children}
    </CourseEditContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCourseEdit() {
  const context = useContext(CourseEditContext);
  if (context === undefined) {
    throw new Error('useCourseEdit must be used within a CourseEditProvider');
  }
  return context;
}
