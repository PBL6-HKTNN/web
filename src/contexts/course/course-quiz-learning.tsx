import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Quiz } from '@/types/db/course/quiz';
import type { QuizQuestion } from '@/types/db/course/quiz-question';

export type UserAnswer = {
  questionId: string;
  selectedAnswerIds?: string[]; // For multiple choice / single choice
  textAnswer?: string; // For short answer
};

export type QuizResult = {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: UserAnswer[];
  timeTaken?: number; // in seconds
};

interface CourseQuizLearningContextType {
  // Current quiz state
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isSubmitted: boolean;
  quizResult: QuizResult | null;
  
  // Quiz actions
  startQuiz: (quiz: Quiz) => void;
  setAnswer: (questionId: string, answer: Omit<UserAnswer, 'questionId'>) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  
  // Helper functions
  getCurrentQuestion: () => QuizQuestion | null;
  getAnswerForQuestion: (questionId: string) => UserAnswer | undefined;
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

  const startQuiz = useCallback((quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsSubmitted(false);
    setQuizResult(null);
  }, []);

  const setAnswer = useCallback((questionId: string, answer: Omit<UserAnswer, 'questionId'>) => {
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
    if (currentQuiz && currentQuestionIndex < currentQuiz.quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuiz, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const calculateScore = useCallback((quiz: Quiz, answers: UserAnswer[]): QuizResult => {
    let correctAnswers = 0;
    let score = 0;

    quiz.quizQuestions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      
      if (!userAnswer) return;

      // Check answer based on question type
      if (question.type === 'multiple_choice' || question.type === 'single_choice') {
        const correctAnswerIds = question.answers
          .filter(a => a.isCorrect)
          .map(a => a.id)
          .sort();
        
        const userAnswerIds = (userAnswer.selectedAnswerIds || []).sort();
        
        if (JSON.stringify(correctAnswerIds) === JSON.stringify(userAnswerIds)) {
          correctAnswers++;
          score += question.marks;
        }
      } else if (question.type === 'true_false') {
        const correctAnswer = question.answers.find(a => a.isCorrect);
        const userSelectedId = userAnswer.selectedAnswerIds?.[0];
        
        if (correctAnswer && userSelectedId === correctAnswer.id) {
          correctAnswers++;
          score += question.marks;
        }
      } else if (question.type === 'short_answer') {
        // For short answer, we'll do case-insensitive comparison with any correct answer
        const correctAnswerTexts = question.answers
          .filter(a => a.isCorrect)
          .map(a => a.text.toLowerCase().trim());
        
        const userText = (userAnswer.textAnswer || '').toLowerCase().trim();
        
        if (correctAnswerTexts.some(correct => correct === userText)) {
          correctAnswers++;
          score += question.marks;
        }
      }
    });

    const percentage = (score / quiz.totalMarks) * 100;
    const passed = score >= quiz.passingScore;

    return {
      quizId: quiz.id,
      totalQuestions: quiz.quizQuestions.length,
      correctAnswers,
      score,
      maxScore: quiz.totalMarks,
      percentage,
      passed,
      answers,
    };
  }, []);

  const submitQuiz = useCallback(() => {
    if (!currentQuiz) return;

    const result = calculateScore(currentQuiz, userAnswers);
    setQuizResult(result);
    setIsSubmitted(true);
  }, [currentQuiz, userAnswers, calculateScore]);

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsSubmitted(false);
    setQuizResult(null);
  }, []);

  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.quizQuestions.length) {
      return null;
    }
    return currentQuiz.quizQuestions[currentQuestionIndex];
  }, [currentQuiz, currentQuestionIndex]);

  const getAnswerForQuestion = useCallback((questionId: string): UserAnswer | undefined => {
    return userAnswers.find(a => a.questionId === questionId);
  }, [userAnswers]);

  const canGoNext = useCallback(() => {
    return currentQuiz !== null && currentQuestionIndex < currentQuiz.quizQuestions.length - 1;
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
