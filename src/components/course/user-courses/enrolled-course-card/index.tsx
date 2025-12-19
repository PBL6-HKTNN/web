import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  EnrolledCourseItem,
  EnrollmentStatus,
  EnrollmentProgressStatus,
} from "@/types/db/course/enrollment";

interface EnrolledCourseCardProps {
  course: EnrolledCourseItem &
    Partial<{
      enrollmentStatus: EnrollmentStatus;
      progressStatus: EnrollmentProgressStatus;
    }>;
}

export function EnrolledCourseCard({ course }: EnrolledCourseCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-none transition-all duration-500 hover:shadow-2xl hover:ring-1 hover:ring-primary/50 min-h-[200px]"
      onClick={() => navigate({ to: `/learn/${course.id}` })}
    >
      {/* Background Image with Blending */}
      <div className="absolute inset-0 z-0">
        <img
          src={course.thumbnail || "/placeholder-course.jpg"}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-900/40" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-primary" />
      </div>

      {/* Course Content */}
      <div className="relative z-10 flex h-full flex-col p-6 text-white">
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex items-center gap-2">
            {course.enrollmentStatus !== undefined && (
              <Badge
                className={`${renderEnrollmentStatusBg(course.enrollmentStatus)} border-none font-bold backdrop-blur-md shadow-sm`}
              >
                {renderEnrollmentStatusLabel(course.enrollmentStatus)}
              </Badge>
            )}
            {course.progressStatus !== undefined && (
              <Badge
                variant="outline"
                className={`${renderProgressStatusBg(course.progressStatus)} font-bold border-white/20 text-white backdrop-blur-md shadow-sm`}
              >
                {renderProgressStatusLabel(course.progressStatus)}
              </Badge>
            )}
          </div>

          <h3 className="mb-2 line-clamp-1 text-2xl font-extrabold tracking-tight group-hover:text-primary-foreground transition-colors">
            {course.title}
          </h3>

          {course.description && (
            <p className="mb-6 line-clamp-2 text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
              {course.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white font-bold text-sm shadow-inner">
                {course.instructorId.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Instructor
                </span>
                <span className="font-bold text-sm truncate max-w-[150px] text-gray-100">
                  {course.instructorId}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="hidden sm:flex font-bold shadow-2xl bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function renderEnrollmentStatusLabel(status?: EnrollmentStatus) {
  switch (status) {
    case 0:
      return "Active";
    case 1:
      return "Completed";
    case 2:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

function renderEnrollmentStatusBg(status?: EnrollmentStatus) {
  switch (status) {
    case 0:
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case 1:
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case 2:
      return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border border-slate-500/30";
  }
}

function renderProgressStatusLabel(status?: EnrollmentProgressStatus) {
  switch (status) {
    case 0:
      return "Not started";
    case 1:
      return "In progress";
    case 2:
      return "Completed";
    default:
      return "Unknown";
  }
}

function renderProgressStatusBg(status?: EnrollmentProgressStatus) {
  switch (status) {
    case 0:
      return "bg-slate-500/10 text-slate-300";
    case 1:
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case 2:
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-slate-500/10 text-slate-300";
  }
}
