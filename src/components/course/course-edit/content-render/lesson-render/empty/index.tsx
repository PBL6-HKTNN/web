"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Brain } from "lucide-react";
import type { LessonReq } from "@/types/db/course/lesson";

interface EmptyLessonRenderProps {
  onSelectType: (type: LessonReq["lessonType"]) => void;
}

export function EmptyLessonRender({ onSelectType }: EmptyLessonRenderProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Select Lesson Type</CardTitle>
        <CardDescription>
          Choose the type of content for this lesson
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-32 flex-col gap-3"
            onClick={() => onSelectType("markdown")}
          >
            <FileText className="h-8 w-8" />
            <div className="text-center">
              <p className="font-semibold">Markdown</p>
              <p className="text-xs text-muted-foreground">Rich text content</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex-col gap-3"
            onClick={() => onSelectType("video")}
          >
            <Video className="h-8 w-8" />
            <div className="text-center">
              <p className="font-semibold">Video</p>
              <p className="text-xs text-muted-foreground">Video lesson</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-32 flex-col gap-3"
            onClick={() => onSelectType("quiz")}
          >
            <Brain className="h-8 w-8" />
            <div className="text-center">
              <p className="font-semibold">Quiz</p>
              <p className="text-xs text-muted-foreground">Assessment</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
