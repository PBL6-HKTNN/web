import { useParams, useNavigate } from "@tanstack/react-router";
import { useGetCourseContentById } from "@/hooks/queries/course/course-hooks";
import {
  useIsEnrolled,
  useGetEnrolledCourseCompletedLessons,
} from "@/hooks/queries/course/enrollment-hooks";
import { useGetLessonById } from "@/hooks/queries/course/lesson-hooks";
import {
  useGetCertStatus,
  useGenerateCertificate,
  useDownloadCertificate,
} from "@/hooks/queries/course/certificate-hooks";
import type { Course } from "@/types/db/course";
import type { Module } from "@/types/db/course/module";
import { EnrollmentProgressStatus } from "@/types/db/course/enrollment";

export function useCourseOverview() {
  const { courseId } = useParams({ from: "/learn/$courseId/" });
  const navigate = useNavigate();

  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourseContentById(courseId);

  const course: Course | undefined = courseData?.data?.course || undefined;
  const modules: Module[] = courseData?.data?.module || [];

  // Get enrollment data to check current view
  const { data: enrollmentResponse } = useIsEnrolled(courseId);
  const enrollment = enrollmentResponse?.data?.enrollment;
  const currentViewLessonId = enrollment?.currentView;

  // Get completed lessons from API
  const { data: completedLessonsResponse } =
    useGetEnrolledCourseCompletedLessons(enrollment?.id || "");
  const completedLessons = completedLessonsResponse?.data || [];

  // Get current view lesson details if available
  const { data: currentLessonResponse } = useGetLessonById(
    currentViewLessonId || ""
  );
  const currentLesson = currentLessonResponse?.data;

  // Certificate hooks
  const { data: certStatusResponse, refetch: refetchCertStatus } =
    useGetCertStatus(enrollment?.id);
  const generateCertificate = useGenerateCertificate();
  const downloadCertificate = useDownloadCertificate();

  const certificateStatus = certStatusResponse?.data;
  const isCourseCompleted =
    enrollment?.progressStatus === EnrollmentProgressStatus.COMPLETED;

  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    navigate({
      to: "/learn/$courseId/$moduleId/$lessonId",
      params: {
        courseId,
        moduleId,
        lessonId,
      },
    });
  };

  const totalLessons = modules.reduce(
    (total: number, module) => total + (module.lessons?.length || 0),
    0
  );

  const isLoading = courseLoading;
  const error = courseError;

  const handleContinueLearning = () => {
    if (currentLesson) {
      // Find the module that contains this lesson
      const moduleId = currentLesson.moduleId;
      navigate({
        to: "/learn/$courseId/$moduleId/$lessonId",
        params: {
          courseId,
          moduleId: moduleId,
          lessonId: currentLesson.id,
        },
      });
    }
  };

  const handleGenerateCertificate = () => {
    if (enrollment?.id) {
      generateCertificate.mutate(enrollment.id, {
        onSuccess: () => {
          refetchCertStatus();
        },
      });
    }
  };

  const handleDownloadCertificate = () => {
    if (enrollment?.id) {
      downloadCertificate.mutate(enrollment.id, {
        onSuccess: (response) => {
          if (response.data?.downloadUrl) {
            window.open(response.data.downloadUrl, "_blank");
          }
        },
      });
    }
  };

  return {
    course,
    modules,
    totalLessons,
    isLoading,
    error,
    handleLessonSelect,
    currentLesson,
    handleContinueLearning,
    hasCurrentLesson: !!currentLesson,
    completedLessons,
    enrollmentProgressStatus: enrollment?.progressStatus,
    // Certificate related
    certificateStatus,
    isCourseCompleted,
    generateCertificate,
    downloadCertificate,
    handleGenerateCertificate,
    handleDownloadCertificate,
    enrollment,
  };
}
