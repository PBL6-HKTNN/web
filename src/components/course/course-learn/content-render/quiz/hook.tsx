import { useNavigate, useParams } from "@tanstack/react-router"
import { useGetQuizByLessonId } from "@/hooks/queries/course/quiz-hooks"
import type { Lesson } from "@/types/db/course/lesson"

export function useQuizContent(lesson: Lesson) {
  const navigate = useNavigate()
  const { courseId, moduleId, lessonId } = useParams({
    from: "/learn/$courseId/$moduleId/$lessonId",
  })

  // Get quiz data by lesson ID
  const { 
    data: quizData, 
    isLoading: isLoadingQuiz, 
    error: quizError 
  } = useGetQuizByLessonId(lessonId)

  const handleStartQuiz = () => {
    // Get quiz ID from the API response or from lesson.quiz.id as fallback
    const quizId = quizData?.data?.id || lesson.quiz?.id
    
    if (quizId) {
      navigate({
        to: "/learn/$courseId/$moduleId/$lessonId/quiz",
        params: { courseId, moduleId, lessonId },
        search: { quizId: quizId }
      })
    }
  }

  // Use quiz data from API if available, otherwise fallback to lesson.quiz
  const quiz = quizData?.data || lesson.quiz

  return {
    quiz,
    isLoading: isLoadingQuiz,
    error: quizError,
    handleStartQuiz,
  }
}