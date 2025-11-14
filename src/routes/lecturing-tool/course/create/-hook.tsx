import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { getAuthState } from '@/hooks/queries/auth-hooks';

export function useCourseCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useToast();

  // Get current user as instructor
  const { user } = getAuthState();
  const instructorId = user?.id;

  const handleCourseCreated = (courseId: string) => {
    success('Course created successfully!');
    navigate({
      to: '/lecturing-tool/course/$courseId',
      params: { courseId },
    });
  };

  const handleCourseCreateError = (errorMessage: string) => {
    error(`Failed to create course: ${errorMessage}`);
  };

  return {
    instructorId,
    handleCourseCreated,
    handleCourseCreateError,
  };
}