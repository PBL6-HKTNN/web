import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useBeginQuizAttempt } from '@/hooks/queries/course/quiz-hooks'
import { useCourseQuizLearning } from '@/contexts/course/course-quiz-learning'
import type { UUID } from '@/types'
import { useToast } from '@/hooks/use-toast'

export function useQuizDoingPage() {
  const { courseId, moduleId, lessonId } = useParams({
    from: '/learn/$courseId/$moduleId/$lessonId/quiz/',
  })
  const { quizId } = useSearch({
    from: '/learn/$courseId/$moduleId/$lessonId/quiz/',
  })
  const navigate = useNavigate()
  
  const [shouldBeginAttempt, setShouldBeginAttempt] = useState(false)
  const { error: errorToast } = useToast()
  const {
    currentQuiz,
    currentQuestionIndex,
    setAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    startQuiz,
    getCurrentQuestion,
    getAnswerForQuestion,
    canGoNext,
    canGoPrevious,
    isSubmitted,
  } = useCourseQuizLearning()

  // Begin quiz attempt when needed
  const beginQuizMutation = useBeginQuizAttempt(quizId as UUID)

  // Validate query params and begin attempt on mount
  useEffect(() => {
    const beginAttempt = async () => {
      try {
        const data = await beginQuizMutation.mutateAsync()
        if (data?.data) {
          const attemptResponse = data.data
          const newAttemptId = attemptResponse.quizAttempt?.id
          const quizFromAttempt = attemptResponse.quiz
          
          if (newAttemptId && quizFromAttempt) {
            // Start quiz immediately with the quiz data from attempt response
            startQuiz(quizFromAttempt, newAttemptId)
          }
        }
      } catch (error) {
        console.error('Failed to begin quiz attempt:', error)
        errorToast("Failed to start quiz. Please try again.")
      }
    }
    if (!quizId) {
      navigate({
        to: '/learn/$courseId/$moduleId/$lessonId',
        params: { courseId, moduleId, lessonId },
      })
      return
    }

    // Begin quiz attempt only once when component mounts and we have quizId
    if (quizId && !shouldBeginAttempt) {
      setShouldBeginAttempt(true)
      beginAttempt()
    }
  }, [quizId, shouldBeginAttempt, navigate, courseId, moduleId, lessonId, beginQuizMutation, startQuiz, errorToast])

  // Auto-submit quiz on unmount if quiz is in progress
  useEffect(() => {
    return () => {
      // Only submit if we have a quiz and it's not already submitted
      if (currentQuiz && !isSubmitted) {
        // Use a ref or a simpler approach to avoid dependency issues
        submitQuiz().catch(console.error)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmitQuiz = useCallback(async () => {
    await submitQuiz()
    navigate({
      to: '/learn/$courseId/$moduleId/$lessonId/quiz/result',
      params: { courseId, moduleId, lessonId },
    })
  }, [submitQuiz, navigate, courseId, moduleId, lessonId])

  const handleAnswerChange = useCallback((answer: Record<string, unknown>) => {
    const currentQuestion = getCurrentQuestion()
    if (currentQuestion && currentQuestion.questionId) {
      setAnswer(currentQuestion.questionId, answer)
    }
  }, [getCurrentQuestion, setAnswer])

  const handlePreviousQuestion = useCallback(() => {
    previousQuestion()
  }, [previousQuestion])

  const handleNextQuestion = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  const handleBackToLesson = useCallback(() => {
    navigate({ 
      to: '/learn/$courseId/$moduleId/$lessonId',
      params: { courseId, moduleId, lessonId }
    })
  }, [navigate, courseId, moduleId, lessonId])

  const currentQuestion = getCurrentQuestion()
  const currentAnswer = currentQuestion
    ? getAnswerForQuestion(currentQuestion.questionId!)
    : undefined

  const progress = currentQuiz?.questions?.length 
    ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100
    : 0
  const isLoading = beginQuizMutation.isPending
  const hasError = beginQuizMutation.error || (!currentQuiz && !isLoading)

  return {
    // Data
    currentQuiz,
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    progress,
    
    // States
    isLoading,
    hasError,
    
    // Handlers
    handleSubmitQuiz,
    handleAnswerChange,
    handlePreviousQuestion,
    handleNextQuestion,
    handleBackToLesson,
    
    // Quiz navigation
    canGoNext,
    canGoPrevious,
    
    // Helper functions
    getAnswerForQuestion,
  }
}