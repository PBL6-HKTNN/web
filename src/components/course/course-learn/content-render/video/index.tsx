import { useRef, useCallback, useEffect, useState } from "react";
import type { Lesson } from "@/types/db/course/lesson";
import type { UUID } from "@/types";
import type { QuizInVideo } from "@/types/db/course/quiz-question";
import { useCourseProgress } from "@/contexts/course/course-progress/hook";
import { useCheckLessonVideo } from "@/hooks/queries/course/lesson-hooks";
import { isYouTubeUrl, getYouTubeEmbedUrl } from "@/utils/video-utils";
import { parseTimespanToSeconds } from "@/utils/time-utils";
import QuizInVideoModal from "@/components/course/quiz-in-video";

type VideoContentProps = {
  lesson: Lesson;
  courseId: UUID;
};

export default function VideoContent({ lesson, courseId }: VideoContentProps) {
  const {
    trackVideoProgress,
    updateCurrentViewWithWatchedSeconds,
    getCurrentEnrollment,
    getWatchedSecondsForCurrentView,
  } = useCourseProgress();
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef<number>(0);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizInVideo | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Fetch quiz data for this lesson
  const { data: quizData } = useCheckLessonVideo(lesson.id);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      // Save last seen time
      lastTimeRef.current = currentTime;
      trackVideoProgress(currentTime, duration, courseId, lesson.id);

      // Check if quiz should be triggered
      if (quizData?.data && !quizAnswered && !isQuizModalOpen) {
        const quizTimestampSeconds = parseTimespanToSeconds(quizData.data.time);
        // Trigger quiz if within 1 second of the timestamp
        if (
          Math.abs(currentTime - quizTimestampSeconds) < 1 &&
          currentTime >= quizTimestampSeconds
        ) {
          // Snap to exact quiz timestamp and trigger modal
          try {
            if (videoRef.current)
              videoRef.current.currentTime = quizTimestampSeconds;
          } catch {
            // ignore
          }
          setCurrentQuiz({
            ...quizData.data,
            id: quizData.data.id,
            lessonId: quizData.data.lessonId,
          } as QuizInVideo);
          setIsQuizModalOpen(true);
        }
      }
    }
  }, [
    trackVideoProgress,
    courseId,
    lesson.id,
    quizData,
    quizAnswered,
    isQuizModalOpen,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;
    const watchedSeconds = getWatchedSecondsForCurrentView();
    const enrollment = getCurrentEnrollment();
    if (!videoEl || !watchedSeconds || !enrollment) return;
    if (enrollment.currentView !== lesson.id) return;
    const setTime = () => {
      try {
        videoEl.currentTime = Math.floor(watchedSeconds);
      } catch {
        // ignore
      }
    };
    if (videoEl.readyState >= 1) {
      setTime();
    } else {
      videoEl.addEventListener("loadedmetadata", setTime);
      return () => videoEl.removeEventListener("loadedmetadata", setTime);
    }
  }, [getWatchedSecondsForCurrentView, getCurrentEnrollment, lesson.id]);

  // On unmount, persist the last watched position for this lesson
  useEffect(() => {
    // Copy refs locally to avoid referencing mutated values in the cleanup
    const videoEl = videoRef.current;
    return () => {
      const watchedSeconds = Math.floor(
        lastTimeRef.current || videoEl?.currentTime || 0
      );
      if (watchedSeconds && courseId && lesson.id) {
        try {
          updateCurrentViewWithWatchedSeconds(
            courseId,
            lesson.id,
            watchedSeconds
          );
          // Persist to localStorage so next visit can read it
          try {
            localStorage.setItem(
              `course-watch:${courseId}:${lesson.id}`,
              String(watchedSeconds)
            );
          } catch {
            // ignore
          }
        } catch (e) {
          // Best-effort; don't block unmount
          // Log for debugging if available
          console.warn("Failed to update current view with watched seconds", e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lesson.id]);

  // Pause video when quiz modal opens and prevent resume until answered
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isQuizModalOpen) {
      try {
        videoEl.pause();
        videoEl.controls = false; // hide/disable controls while quiz is active
      } catch {
        // ignore
      }
    } else {
      try {
        videoEl.controls = true; // restore controls
        if (quizAnswered) {
          // Resume playback only after quiz answered
          void videoEl.play();
        }
      } catch {
        // ignore
      }
    }
  }, [isQuizModalOpen, quizAnswered]);

  // Prevent keyboard shortcuts (space/k) from resuming playback while quiz modal is open
  useEffect(() => {
    if (!isQuizModalOpen) return;

    const handler = (e: KeyboardEvent) => {
      // Allow keyboard interactions when focus is inside the modal content
      const active = document.activeElement as HTMLElement | null;
      if (active && active.closest && active.closest(".quiz-modal-content"))
        return;

      if (e.code === "Space" || e.key === "k") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [isQuizModalOpen]);

  if (!lesson.contentUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Video content is not available for this lesson.
        </p>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const watchedSecondsForThisView = getWatchedSecondsForCurrentView();
  const enrollment = getCurrentEnrollment();

  if (isYouTubeUrl(lesson.contentUrl)) {
    const embedUrl = getYouTubeEmbedUrl(lesson.contentUrl);
    if (embedUrl) {
      const url =
        watchedSecondsForThisView && enrollment?.currentView === lesson.id
          ? `${embedUrl}?start=${Math.floor(watchedSecondsForThisView)}`
          : embedUrl;
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={url}
            title={lesson.title || "YouTube Video"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  // Default to HTML5 video for direct video URLs
  return (
    <>
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          controls
          className="w-full h-full"
          src={lesson.contentUrl}
          poster={lesson.contentUrl ? `${lesson.contentUrl}?poster` : undefined}
          onTimeUpdate={handleTimeUpdate}
        >
          Your browser does not support the video tag.
        </video>

        {/* Overlay to block interactions while quiz is active */}
        {isQuizModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center pointer-events-auto">
            <div className="text-white text-sm font-medium">
              Please answer the quiz to continue
            </div>
          </div>
        )}
      </div>

      {currentQuiz && (
        <QuizInVideoModal
          isOpen={isQuizModalOpen}
          onOpenChange={setIsQuizModalOpen}
          quiz={currentQuiz}
          onSuccess={() => {
            setQuizAnswered(true);
            setIsQuizModalOpen(false);
          }}
        />
      )}
    </>
  );
}
