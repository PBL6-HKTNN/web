"use client";

import { useCourseEdit } from "@/contexts/course/course-edit";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Clock, Eye, EyeOff, HelpCircle, Trash2 } from "lucide-react";
import type { LessonType } from "@/types/db/course/lesson";

export function CurrentSelectedSidebar({ isLoading = false }: { isLoading?: boolean }) {
  const {
    selectMode,
    getSelectedModule,
    getSelectedLesson,
    openDeleteModal,
  } = useCourseEdit();

  const selectedModule = getSelectedModule();
  const selectedLesson = getSelectedLesson();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getLessonTypeBadge = (lessonType: LessonType | null) => {
    switch (lessonType) {
      case "video":
        return { variant: "default" as const, label: "Video" };
      case "markdown":
        return { variant: "secondary" as const, label: "Markdown" };
      case "quiz":
        return { variant: "default" as const, label: "Quiz" };
      default:
        return { variant: "outline" as const, label: "Unknown" };
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-4 w-8" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  if (selectMode === "module" && selectedModule) {
    return (
      <div className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Module Details
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => selectedModule?.id && openDeleteModal('module', selectedModule.id)}
              className="h-7 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-1">Title</h3>
            <p className="text-sm text-muted-foreground">{selectedModule.title}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Order</h3>
              <p className="text-sm text-muted-foreground">{selectedModule.order}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Lessons</h3>
              <p className="text-sm text-muted-foreground">{selectedModule.lessons.length}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-sm mb-2">Lessons</h3>
            <div className="space-y-2">
              {selectedModule.lessons.length > 0 ? (
                selectedModule.lessons.map((lesson, index) => {
                  const badgeInfo = getLessonTypeBadge(lesson.lessonType);
                  return (
                    <div key={lesson.id || index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs truncate flex-1">{lesson.title}</span>
                      <Badge variant={badgeInfo.variant} className="text-xs px-1.5 py-0.5">
                        {badgeInfo.label}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground italic">No lessons in this module</p>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    );
  }

  if (selectMode === "lesson" && selectedLesson) {
    return (
      <div className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lesson Details
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => selectedLesson?.id && selectedModule?.id && openDeleteModal('lesson', selectedModule.id, selectedLesson.id)}
              className="h-7 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-1">Title</h3>
            <p className="text-sm text-muted-foreground">{selectedLesson.title}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Type</h3>
              <Badge variant={getLessonTypeBadge(selectedLesson.lessonType).variant} className="text-xs">
                {getLessonTypeBadge(selectedLesson.lessonType).label}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Duration</h3>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDuration(selectedLesson.duration)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-1">Preview</h3>
            <div className="flex items-center gap-2">
              {selectedLesson.isPreviewable ? (
                <>
                  <Eye className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Available</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Not available</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {selectedLesson.lessonType === "quiz" && selectedLesson.quiz ? (
            <div>
              <h3 className="font-medium text-sm mb-2">Quiz Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Questions: </span>
                  <span className="text-xs font-medium">
                    {selectedLesson.quiz.quizQuestions.length}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total Points: </span>
                  <span className="text-xs font-medium">
                    {selectedLesson.quiz.quizQuestions.reduce((total, q) => total + (q.marks || 0), 0)}
                  </span>
                </div>
              </div>
            </div>
          ) : selectedLesson.lessonType === "video" ? (
            <div>
              <h3 className="font-medium text-sm mb-2">Video Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Video URL: </span>
                  {selectedLesson.contentUrl ? (
                    <div className="mt-1">
                      <p className="text-xs font-medium break-all bg-muted/50 p-2 rounded">
                        {selectedLesson.contentUrl}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No video URL set</span>
                  )}
                </div>
              </div>
            </div>
          ) : selectedLesson.lessonType === "markdown" ? (
            <div>
              <h3 className="font-medium text-sm mb-2">Content Preview</h3>
              <div className="bg-muted/50 p-2 rounded-md">
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {selectedLesson.rawContent.substring(0, 100)}
                  {selectedLesson.rawContent.length > 100 && "..."}
                </p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </div>
    );
  }

  if (selectMode === "lesson" && selectedLesson) {
    return (
      <>
        <div className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Lesson Details
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => selectedLesson?.id && selectedModule?.id && openDeleteModal('lesson', selectedModule.id, selectedLesson.id)}
                className="h-7 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-1">Title</h3>
              <p className="text-sm text-muted-foreground">{selectedLesson.title}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Type</h3>
                <Badge variant={getLessonTypeBadge(selectedLesson.lessonType).variant} className="text-xs">
                  {getLessonTypeBadge(selectedLesson.lessonType).label}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Duration</h3>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(selectedLesson.duration)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-1">Preview</h3>
              <div className="flex items-center gap-2">
                {selectedLesson.isPreviewable ? (
                  <>
                    <Eye className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Available</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Not available</span>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {selectedLesson.lessonType === "quiz" && selectedLesson.quiz ? (
              <div>
                <h3 className="font-medium text-sm mb-2">Quiz Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Questions: </span>
                    <span className="text-xs font-medium">
                      {selectedLesson.quiz.quizQuestions.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Total Points: </span>
                    <span className="text-xs font-medium">
                      {selectedLesson.quiz.quizQuestions.reduce((total, q) => total + (q.marks || 0), 0)}
                    </span>
                  </div>
                </div>
              </div>
            ) : selectedLesson.lessonType === "video" ? (
              <div>
                <h3 className="font-medium text-sm mb-2">Video Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Video URL: </span>
                    {selectedLesson.contentUrl ? (
                      <div className="mt-1">
                        <p className="text-xs font-medium break-all bg-muted/50 p-2 rounded">
                          {selectedLesson.contentUrl}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No video URL set</span>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedLesson.lessonType === "markdown" ? (
              <div>
                <h3 className="font-medium text-sm mb-2">Content Preview</h3>
                <div className="bg-muted/50 p-2 rounded">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {selectedLesson.rawContent?.substring(0, 150) || "No content"}
                    {selectedLesson.rawContent && selectedLesson.rawContent.length > 150 ? "..." : ""}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </div>
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Selection Details</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a module or lesson</p>
          <p className="text-xs">to view its details</p>
        </div>
      </CardContent>
    </div>
  );
}
