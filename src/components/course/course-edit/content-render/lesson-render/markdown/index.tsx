"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { LessonReq } from "@/types/db/course/lesson";
import { MarkdownEditor } from "@/components/shared/md-editor";

interface MarkdownLessonRenderProps {
  lesson: LessonReq;
  onUpdateContent: (content: string) => void;
}

export function MarkdownLessonRender({ lesson, onUpdateContent }: MarkdownLessonRenderProps) {
  return (
    <Card className="h-full overflow-y-auto flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Markdown Content</CardTitle>
        </div>
        <CardDescription>
          Write and format your lesson content using markdown
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <MarkdownEditor
          value={lesson.rawContent}
          onChange={onUpdateContent}
          placeholder="Start writing your lesson content..."
          height="100%"
          className="h-full"
        />
      </CardContent>
    </Card>
  );
}
