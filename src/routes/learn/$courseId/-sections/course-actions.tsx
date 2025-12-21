/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Award,
  Download,
  Circle,
  Clock3,
  CheckCircle,
  Activity,
} from "lucide-react";
import { EnrollmentProgressStatus } from "@/types/db/course/enrollment";
import AddToCalendar from "@/components/course/add-to-calendar";
import type { Lesson } from "@/types/db/course/lesson";
import type { UUID } from "@/types";

interface CourseActionsProps {
  courseId: UUID;
  enrollmentProgressStatus: EnrollmentProgressStatus | undefined;
  hasCurrentLesson: boolean;
  currentLesson: Lesson | undefined;
  handleContinueLearning: () => void;
  certificateStatus: any;
  isCourseCompleted: boolean;
  generateCertificate: any;
  downloadCertificate: any;
  handleGenerateCertificate: () => void;
  handleDownloadCertificate: () => void;
  onViewCertificate: () => void;
}

export function CourseActions({
  courseId,
  enrollmentProgressStatus,
  hasCurrentLesson,
  currentLesson,
  handleContinueLearning,
  certificateStatus,
  isCourseCompleted,
  generateCertificate,
  downloadCertificate,
  handleGenerateCertificate,
  handleDownloadCertificate,
  onViewCertificate,
}: CourseActionsProps) {
  const getProgressStatusDisplay = (
    status: EnrollmentProgressStatus | undefined
  ) => {
    switch (status) {
      case EnrollmentProgressStatus.NOT_STARTED:
        return {
          icon: Circle,
          label: "Not Started",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        };
      case EnrollmentProgressStatus.IN_PROGRESS:
        return {
          icon: Clock3,
          label: "In Progress",
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950",
        };
      case EnrollmentProgressStatus.COMPLETED:
        return {
          icon: CheckCircle,
          label: "Completed",
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950",
        };
      default:
        return {
          icon: Circle,
          label: "Unknown",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        };
    }
  };

  const progressStatus = getProgressStatusDisplay(enrollmentProgressStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Status */}
        <div className={`p-4 rounded-lg border ${progressStatus.bgColor}`}>
          <div className="flex items-center gap-3">
            <progressStatus.icon
              className={`w-5 h-5 ${progressStatus.color}`}
            />
            <div>
              <h4 className="font-medium">Status</h4>
              <p className={`text-sm ${progressStatus.color}`}>
                {progressStatus.label}
              </p>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {hasCurrentLesson && currentLesson ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Next Up</h4>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {currentLesson.title}
              </p>
              <Button onClick={handleContinueLearning} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a lesson from the course content to start learning.
            </p>
          </div>
        )}

        <Separator />

        {/* Certificate Section */}
        {isCourseCompleted && (
          <>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificate
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {certificateStatus?.status === "Available"
                    ? "Ready for download"
                    : "Get your certificate"}
                </p>

                {certificateStatus?.status === "Available" &&
                certificateStatus?.certificateUrl ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onViewCertificate}
                      className="w-full"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDownloadCertificate}
                      disabled={downloadCertificate.isPending}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadCertificate.isPending
                        ? "Downloading..."
                        : "Download"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleGenerateCertificate}
                    disabled={generateCertificate.isPending}
                    className="w-full"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    {generateCertificate.isPending
                      ? "Generating..."
                      : "Generate"}
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Add to Calendar Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Schedule</h4>
            <AddToCalendar courseId={courseId} />
          </div>
          <p className="text-sm text-muted-foreground">
            Sync with Google Calendar
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
