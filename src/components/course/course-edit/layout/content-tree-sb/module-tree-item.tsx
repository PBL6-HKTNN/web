"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Plus, BookOpen, Play, Trash2 } from "lucide-react";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import type { Module } from "@/types/db/course/module";
import { LessonType } from "@/types/db/course/lesson";
import { renderLessonType } from "@/utils/render-utils";

interface ModuleTreeItemProps {
  module: Module;
  isExpanded: boolean;
  onToggleExpansion: (moduleId: string) => void;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  onAddLesson: (moduleId: string) => void;
  onDeleteModule: (moduleId: string, moduleTitle: string) => void;
  onDeleteLesson: (lessonId: string, lessonTitle: string) => void;
  isSelected: boolean;
}

export function ModuleTreeItem({
  module,
  isExpanded,
  onToggleExpansion,
  onModuleSelect,
  onLessonSelect,
  onAddLesson,
  onDeleteModule,
  onDeleteLesson,
  isSelected,
}: ModuleTreeItemProps) {
  const { selectedLessonId } = useCourseEdit();
  
  // Use lessons directly from module data
  const lessons = module.lessons || [];

  const getLessonTypeBadge = (lessonType: LessonType) => {
    switch (lessonType) {
      case LessonType.MARKDOWN:
        return { variant: "secondary" as const, label: renderLessonType(LessonType.MARKDOWN) };
      case LessonType.VIDEO:
        return { variant: "default" as const, label: renderLessonType(LessonType.VIDEO) };
      case LessonType.QUIZ:
        return { variant: "default" as const, label: renderLessonType(LessonType.QUIZ) };
      default:
        return { variant: "outline" as const, label: "?" };
    }
  };

  return (
    <div className="space-y-1">
      {/* Module Header */}
      <div
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
        }`}
        onClick={() => onModuleSelect(module.id)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(module.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
          <BookOpen className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium truncate">{module.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(module.id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteModule(module.id, module.title);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Lessons */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {lessons.sort((a, b) => a.orderIndex - b.orderIndex).map((lesson) => {
            const badge = getLessonTypeBadge(lesson.lessonType);
            const isLessonSelected = selectedLessonId === lesson.id;
            
            return (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  isLessonSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => onLessonSelect(module.id, lesson.id)}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Play className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs truncate">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={badge.variant} className="text-xs px-1.5 py-0.5">
                    {badge.label}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLesson(lesson.id, lesson.title);
                    }}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {lessons.length === 0 && (
            <div className="p-2 text-xs text-muted-foreground text-center">
              No lessons yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}