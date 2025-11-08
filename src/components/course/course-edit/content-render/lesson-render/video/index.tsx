"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Video, Edit, Save, X, Upload, Loader2, Trash2 } from "lucide-react";
import { MediaUploadDialog } from "@/components/shared/image-upload";
import { useUpdateLesson } from "@/hooks/queries/course/lesson-hooks";
import { useToast } from "@/hooks/use-toast";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import type { Lesson } from "@/types/db/course/lesson";
import type { UploadFileRes } from "@/types/core/storage";

interface VideoLessonRenderProps {
  lesson: Lesson;
}

export function VideoLessonRender({ lesson }: VideoLessonRenderProps) {
  const { success, error } = useToast();
  const { openDeleteModal } = useCourseEdit();
  const updateLessonMutation = useUpdateLesson();
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(lesson.contentUrl || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    setVideoUrl(lesson.contentUrl || "");
    setHasChanges(false);
    if (!lesson.contentUrl) {
      setIsEditing(true);
    }
  }, [lesson.contentUrl]);

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    setHasChanges(url !== (lesson.contentUrl || ""));
  };

  const handleSave = async () => {
    try {
      await updateLessonMutation.mutateAsync({
        lessonId: lesson.id,
        data: {
          title: lesson.title,
          moduleId: lesson.moduleId,
          contentUrl: videoUrl,
          duration: lesson.duration,
          orderIndex: lesson.orderIndex,
          isPreview: lesson.isPreview,
          lessonType: lesson.lessonType,
        },
      });
      
      success("Video lesson updated successfully");
      setIsEditing(false);
      setHasChanges(false);
    } catch (err) {
      error(`Failed to update lesson: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setVideoUrl(lesson.contentUrl || "");
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleVideoUpload = (result: UploadFileRes) => {
    setVideoUrl(result.data?.url ?? "n/a");
    setHasChanges(result.data?.url !== (lesson.contentUrl || ""));
  };

  const handleUploadError = (err: Error) => {
    error(err.message);
  };

  const handleDelete = () => {
    openDeleteModal('lesson', lesson.id, lesson.title);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <div>
              <CardTitle>Video Content</CardTitle>
              <CardDescription>
                Add or update the video for this lesson
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && lesson.contentUrl && (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
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

      <CardContent className="flex-1 space-y-4">
        {isEditing || !lesson.contentUrl ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the URL of the video file or upload a new video
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 border-t" />
                <span className="px-3 text-sm text-muted-foreground">OR</span>
                <div className="flex-1 border-t" />
              </div>

              <div className="space-y-2">
                <Label>Upload Video</Label>
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Video File</p>
                    <p className="text-xs text-muted-foreground">
                      Support MP4, WebM, OGV files up to 100MB
                    </p>
                  </div>
                  <MediaUploadDialog
                    onMediaUploaded={(result) => {
                      handleVideoUpload(result);
                      setIsUploadDialogOpen(false);
                    }}
                    onUploadError={handleUploadError}
                    accept="video/*"
                    maxSize={100} // 100MB
                    title="Upload Video"
                    description="Select a video file to upload for this lesson."
                  />
                </Dialog>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {lesson.contentUrl && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || updateLessonMutation.isPending}
              >
                {updateLessonMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Video
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Video URL</p>
              <p className="text-sm text-muted-foreground break-all">{lesson.contentUrl}</p>
            </div>

            {lesson.contentUrl && (
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
                <video
                  src={lesson.contentUrl}
                  controls
                  className="w-full h-full"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}