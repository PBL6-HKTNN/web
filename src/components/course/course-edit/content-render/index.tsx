"use client";

import { ModuleRender } from "./module-render";
import { LessonRender } from "./lesson-render";
import { FileQuestion } from "lucide-react";
import { useContentRender } from "./hook";


export function ContentRender() {
  const { selectMode, selectedLesson, selectedModule } = useContentRender();
 
  if (!selectMode) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center text-muted-foreground">
          <FileQuestion className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Select a module or lesson to edit</p>
        </div>
      </div>
    );
  }

  if (selectMode === "module" && selectedModule) {
    return <ModuleRender module={selectedModule} />;
  }

  if (selectMode === "lesson" && selectedLesson) {
    return <LessonRender lesson={selectedLesson} />;
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center text-muted-foreground">
        <FileQuestion className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">Content not found</p>
      </div>
    </div>
  );
}
