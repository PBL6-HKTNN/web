"use client";

import { useCourseEdit } from "@/contexts/course/use-course-edit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, BookOpen } from "lucide-react";

import { useContentTreeSidebar } from "./hooks";
import { ModuleTreeItem } from "./module-tree-item";

export function ContentTreeSidebar({ isLoading = false }: { isLoading?: boolean }) {
  const {
    selectedModuleId,
  } = useCourseEdit();

  const {
    modules,
    expandedModules,
    isLoadingModules,
    toggleModuleExpansion,
    handleModuleSelect,
    handleLessonSelect,
    handleAddModule,
    handleAddLesson,
    handleDeleteModule,
    handleDeleteLesson,
  } = useContentTreeSidebar();



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
          {isLoading || isLoadingModules ? (
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
            {/* temporary mapping due to api data convention mismatch  */}
              {modules.map((module) => (
                <ModuleTreeItem
                  key={module.id}
                  module={module}
                  isExpanded={expandedModules.has(module.id)}
                  onToggleExpansion={toggleModuleExpansion}
                  onModuleSelect={handleModuleSelect}
                  onLessonSelect={handleLessonSelect}
                  onAddLesson={handleAddLesson}
                  onDeleteModule={handleDeleteModule}
                  onDeleteLesson={handleDeleteLesson}
                  isSelected={selectedModuleId === module.id}
                />
              ))}

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
