import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Quiz, QuizSubmissionReq } from '@/types/db/course/quiz';
import type { QuizQuestion } from '@/types/db/course/quiz-question';
import type { UUID } from '@/types';
import { useSubmitQuiz } from '@/hooks/queries/course/quiz-hooks';
import { useToast } from '@/hooks/use-toast';

export type UserAnswer = {
  questionId: UUID;
  selectedAnswerIds?: UUID[]; // For multiple choice / single choice
  answerText?: string; // For short answer
};

export type QuizResult = {
  quizId: UUID;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  userAnswers: UserAnswer[];
  timeTaken?: number; // in seconds
};

interface CourseQuizLearningContextType {
  // Current quiz state
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isSubmitted: boolean;
  quizResult: QuizResult | null;
  quizAttemptId: UUID | null;
  
  // Quiz actions
  startQuiz: (quiz: Quiz, attemptId: UUID) => void;
  setAnswer: (questionId: UUID, answer: Omit<UserAnswer, 'questionId'>) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  
  // Helper functions
  getCurrentQuestion: () => QuizQuestion | null;
  getAnswerForQuestion: (questionId: UUID) => UserAnswer | undefined;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

const CourseQuizLearningContext = createContext<CourseQuizLearningContextType | undefined>(undefined);

interface CourseQuizLearningProviderProps {
  children: ReactNode;
}

export const CourseQuizLearningProvider: React.FC<CourseQuizLearningProviderProps> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizAttemptId, setQuizAttemptId] = useState<UUID | null>(null);

  const submitQuizMutation = useSubmitQuiz();
  const { error } = useToast()
  const startQuiz = useCallback((quiz: Quiz, attemptId: UUID) => {
    console.log('Starting quiz:', quiz.id, 'with attempt ID:', attemptId);
    setCurrentQuiz(quiz);
    setQuizAttemptId(attemptId);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsSubmitted(false);
    setQuizResult(null);
  }, []);

  const setAnswer = useCallback((questionId: UUID, answer: Omit<UserAnswer, 'questionId'>) => {
    setUserAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      const newAnswer: UserAnswer = { questionId, ...answer };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      
      return [...prev, newAnswer];
    });
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuiz && currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuiz, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const submitQuiz = useCallback(async () => {
    if (!currentQuiz || !quizAttemptId) return;

    try {
      // Format answers for API submission according to QuizSubmissionReq
      const formattedAnswers = userAnswers.map(answer => ({
        questionId: answer.questionId,
        answerText: answer.answerText || "",
        selectedAnswerIds: answer.selectedAnswerIds || []
      }));

      const submissionData: QuizSubmissionReq = {
          quizAttemptId,
          answers: formattedAnswers
      };

      const result = await submitQuizMutation.mutateAsync(submissionData);
      
      if (result.data) {
        const attemptResult = result.data;
        
        // Create QuizResult from API response
        const quizResult: QuizResult = {
          quizId: currentQuiz.id,
          totalQuestions: currentQuiz.questions?.length || 0,
          correctAnswers: 0, // This would need to be calculated from the result
          score: attemptResult.score,
          maxScore: currentQuiz.totalMarks,
          percentage: (attemptResult.score / currentQuiz.totalMarks) * 100,
          passed: attemptResult.passed,
          userAnswers: userAnswers,
        };
        
        setQuizResult(quizResult);
        setIsSubmitted(true);
      }
    } catch (err) {
      // Handle error - maybe show toast notification
      error(err instanceof Error ? err.message : "Failed to submit quiz");
    }
  }, [currentQuiz, userAnswers, quizAttemptId, submitQuizMutation, error]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuizAttemptId(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsSubmitted(false);
    setQuizResult(null);
  }, []);

  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (!currentQuiz || currentQuestionIndex >= (currentQuiz.questions?.length || 0)) {
      return null;
    }
    return currentQuiz.questions?.[currentQuestionIndex] || null;
  }, [currentQuiz, currentQuestionIndex]);

  const getAnswerForQuestion = useCallback((questionId: UUID): UserAnswer | undefined => {
    return userAnswers.find(a => a.questionId === questionId);
  }, [userAnswers]);

  const canGoNext = useCallback(() => {
    return currentQuiz !== null && currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1;
  }, [currentQuiz, currentQuestionIndex]);

  const canGoPrevious = useCallback(() => {
    return currentQuestionIndex > 0;
  }, [currentQuestionIndex]);

  const value: CourseQuizLearningContextType = {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    isSubmitted,
    quizResult,
    quizAttemptId,
    startQuiz,
    setAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    getCurrentQuestion,
    getAnswerForQuestion,
    canGoNext,
    canGoPrevious,
  };

  return (
    <CourseQuizLearningContext.Provider value={value}>
      {children}
    </CourseQuizLearningContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourseQuizLearning = (): CourseQuizLearningContextType => {
  const context = useContext(CourseQuizLearningContext);
  if (context === undefined) {
    throw new Error('useCourseQuizLearning must be used within a CourseQuizLearningProvider');
  }
  return context;
};
