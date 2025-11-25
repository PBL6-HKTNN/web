"use client";

import type { Lesson } from "@/types/db/course/lesson";
import { MarkdownLessonRender } from "./markdown/new-index";
import { VideoLessonRender } from "./video";
import { QuizLessonRender } from "./quiz";
import { EmptyLessonRender } from "./empty";

interface LessonRenderProps {
  lesson: Lesson;
}

export function LessonRender({ lesson }: LessonRenderProps) {
  // Check lesson type and render appropriate component
  if (lesson.lessonType === 0) {
    return <MarkdownLessonRender lesson={lesson} />;
  }

  if (lesson.lessonType === 1) {
    return <VideoLessonRender lesson={lesson} />;
  }

  if (lesson.lessonType === 2) {
    return <QuizLessonRender lesson={lesson} />;
  }

  // If no lesson type is set, show empty state with type selection
  return <EmptyLessonRender onSelectType={() => {}} />;
}