"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Save, Loader2, Trash2, Wand2 } from "lucide-react";
import { MarkdownEditor } from "@/components/shared/md-editor";
import { GenerateMarkdownModal } from "@/components/course/course-edit/modals/generate/markdown";
import { useUpdateLesson } from "@/hooks/queries/course/lesson-hooks";
import { useToast } from "@/hooks/use-toast";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import { useState, useEffect } from "react";
import type { Lesson } from "@/types/db/course/lesson";
import { parseTimespanToSeconds } from "@/utils/time-utils";

interface MarkdownLessonRenderProps {
  lesson: Lesson;
}

export function MarkdownLessonRender({ lesson }: MarkdownLessonRenderProps) {
  const { success, error } = useToast();
  const { openDeleteModal } = useCourseEdit();
  const updateLessonMutation = useUpdateLesson();
  const [content, setContent] = useState(lesson.contentUrl || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    setContent(lesson.contentUrl || "");
    setHasChanges(false);
  }, [lesson.contentUrl]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== (lesson.contentUrl || ""));
  };

  const handleSave = async () => {
    try {
      await updateLessonMutation.mutateAsync({
        lessonId: lesson.id,
        data: {
          title: lesson.title,
          moduleId: lesson.moduleId,
          contentUrl: content, // Store markdown content in contentUrl
          duration: parseTimespanToSeconds(lesson.duration as string),
          orderIndex: lesson.orderIndex,
          isPreview: lesson.isPreview,
          lessonType: lesson.lessonType,
        },
      });
      
      success("Lesson content updated successfully");
      setHasChanges(false);
    } catch (err) {
      error(`Failed to update lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleApplyGeneratedContent = (generatedContent: string) => {
    setContent(generatedContent);
    setHasChanges(true);
  };

  const handleDelete = () => {
    openDeleteModal('lesson', lesson.id, lesson.title);
  };

  return (
    <>
      <Card className="h-full overflow-y-auto flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <div>
              <CardTitle>Markdown Content</CardTitle>
              <CardDescription>
                Write and format your lesson content using markdown
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Button 
                onClick={handleSave} 
                disabled={updateLessonMutation.isPending}
                size="sm"
              >
                {updateLessonMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsGenerateModalOpen(true)}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Content
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDelete}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <MarkdownEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your lesson content..."
          height="100%"
        />
      </CardContent>
    </Card>

    <GenerateMarkdownModal
      isOpen={isGenerateModalOpen}
      onClose={() => setIsGenerateModalOpen(false)}
      onApplyContent={handleApplyGeneratedContent}
    />
    </>
  );
}