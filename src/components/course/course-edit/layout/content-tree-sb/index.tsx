"use client";

import { useCourseEdit } from "@/contexts/course/course-edit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, BookOpen, FileText, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useContentTreeSidebar } from "./hooks";

export function ContentTreeSidebar({ isLoading = false }: { isLoading?: boolean }) {
  const {
    selectedModuleId,
    selectedLessonId,
  } = useCourseEdit();

  const {
    modules,
    expandedModules,
    toggleModuleExpansion,
    handleModuleSelect,
    handleLessonSelect,
    handleAddModule,
    handleAddLesson,
  } = useContentTreeSidebar();

  const getLessonTypeBadge = (lessonType: string | null) => {
    switch (lessonType) {
      case "video":
        return { variant: "default" as const, label: "Video" };
      case "markdown":
        return { variant: "secondary" as const, label: "MD" };
      case "quiz":
        return { variant: "default" as const, label: "Quiz" };
      default:
        return { variant: "outline" as const, label: "?" };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Course Content</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddModule}
            className="h-7 px-2"
            disabled={isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                  {index === 0 && (
                    <div className="ml-6 space-y-1">
                      {Array.from({ length: 2 }).map((_, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center gap-2 p-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 flex-1" />
                          <Skeleton className="h-5 w-12" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              {modules.map((module) => {
                if (!module.id) return null;

                const isExpanded = expandedModules.has(module.id);
                  const isSelected = selectedModuleId === module.id && !selectedLessonId;

                  return (
                    <div key={module.id} className="space-y-1">
                      {/* Module */}
                      <div
                        className={cn(
                          "group flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                          isSelected && "bg-accent"
                        )}
                        onClick={() => handleModuleSelect(module.id!)}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModuleExpansion(module.id!);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate flex-1">
                          {module.title}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLesson(module.id!);
                            if (!isExpanded) toggleModuleExpansion(module.id!);
                          }}
                          title="Add lesson"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Lessons */}
                      {isExpanded && (
                        <div className="ml-6 space-y-1">
                          {module.lessons.map((lesson) => {
                            if (!lesson.id) return null;

                            const isLessonSelected = selectedLessonId === lesson.id;

                            return (
                              <div
                                key={lesson.id}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                                  isLessonSelected && "bg-accent"
                                )}
                                onClick={() => handleLessonSelect(module.id!, lesson.id!)}
                              >
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate flex-1">
                                  {lesson.title}
                                </span>
                                <Badge variant={getLessonTypeBadge(lesson.lessonType).variant} className="text-xs px-1.5 py-0.5">
                                  {getLessonTypeBadge(lesson.lessonType).label}
                                </Badge>
                              </div>
                            );
                          })}

                          {module.lessons.length === 0 && (
                            <div className="text-xs text-muted-foreground italic p-2">
                              No lessons yet
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {modules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No modules yet</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={handleAddModule}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Module
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
