"use client";

import type { LessonReq } from "@/types/db/course/lesson";
import { useLessonRender } from "./hooks";
import { EmptyLessonRender } from "./empty";
import { MarkdownLessonRender } from "./markdown";
import { VideoLessonRender } from "./video";
import { QuizLessonRender } from "./quiz";

interface LessonRenderProps {
  lesson: LessonReq;
}

export function LessonRender({ lesson }: LessonRenderProps) {
  const { selectedLessonType, handleSelectLessonType, handleUpdateContent, handleUpdateContentUrl } =
    useLessonRender(lesson);

  if (!selectedLessonType || selectedLessonType === null) {
    return <EmptyLessonRender onSelectType={handleSelectLessonType} />;
  }

  if (selectedLessonType === "markdown") {
    return <MarkdownLessonRender lesson={lesson} onUpdateContent={handleUpdateContent} />;
  }

  if (selectedLessonType === "video") {
    return <VideoLessonRender lesson={lesson} onUpdateContentUrl={handleUpdateContentUrl} />;
  }

  if (selectedLessonType === "quiz") {
    return <QuizLessonRender lesson={lesson} />;
  }

  return null;
}
