import { authGuard } from "@/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import { LearningNavBar } from "@/components/layout/nav-bar-2";
import { useCourseOverview } from "./-hook";
import {
  CourseHeader,
  CourseStatsCards,
  WelcomeSection,
  CourseContentSection,
  CertificateViewerModal,
  CourseActions,
} from "./-sections";
import { useState } from "react";
import type { Lesson } from "@/types/db/course/lesson";

export const Route = createFileRoute("/learn/$courseId/")({
  component: RouteComponent,
  beforeLoad: authGuard,
});

function CourseOverview() {
  const {
    course,
    modules,
    totalLessons,
    isLoading,
    error,
    handleLessonSelect,
    currentLesson,
    handleContinueLearning,
    hasCurrentLesson,
    completedLessons,
    enrollmentProgressStatus,
    certificateStatus,
    isCourseCompleted,
    generateCertificate,
    downloadCertificate,
    handleGenerateCertificate,
    handleDownloadCertificate,
  } = useCourseOverview();

  const [isCertificateViewerOpen, setIsCertificateViewerOpen] = useState(false);

  if (isLoading) {
    return (
      <>
        <LearningNavBar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <LearningNavBar />
        <div className="flex items-center justify-center min-h-[400px] px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
              <p className="text-muted-foreground text-sm">
                The course you're looking for doesn't exist or you don't have
                access to it.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LearningNavBar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
          {/* Course Header */}
          <CourseHeader course={course} />

          {/* Course Stats Cards */}
          <CourseStatsCards
            course={course}
            modulesCount={modules.length}
            totalLessons={totalLessons}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Info & Modules */}
            <div className="lg:col-span-2 space-y-6">
              <WelcomeSection
                course={course}
                modulesCount={modules.length}
                totalLessons={totalLessons}
              />

              <CourseContentSection
                modules={modules}
                completedLessons={completedLessons}
                onLessonSelect={handleLessonSelect}
              />
            </div>

            {/* Sidebar - Actions */}
            <div className="space-y-6">
              <CourseActions
                courseId={course.id}
                enrollmentProgressStatus={enrollmentProgressStatus}
                hasCurrentLesson={hasCurrentLesson}
                currentLesson={currentLesson as Lesson}
                handleContinueLearning={handleContinueLearning}
                certificateStatus={certificateStatus}
                isCourseCompleted={isCourseCompleted}
                generateCertificate={generateCertificate}
                downloadCertificate={downloadCertificate}
                handleGenerateCertificate={handleGenerateCertificate}
                handleDownloadCertificate={handleDownloadCertificate}
                onViewCertificate={() => setIsCertificateViewerOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        open={isCertificateViewerOpen}
        onOpenChange={setIsCertificateViewerOpen}
        certificateUrl={certificateStatus?.certificateUrl || ""}
        onDownload={handleDownloadCertificate}
        isDownloading={downloadCertificate.isPending}
      />
    </>
  );
}

function RouteComponent() {
  return <CourseOverview />;
}
