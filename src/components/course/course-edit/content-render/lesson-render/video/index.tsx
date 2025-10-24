"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Edit, Save, X } from "lucide-react";
import type { LessonReq } from "@/types/db/course/lesson";

interface VideoLessonRenderProps {
  lesson: LessonReq;
  onUpdateContentUrl: (url: string) => void;
}

export function VideoLessonRender({ lesson, onUpdateContentUrl }: VideoLessonRenderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(lesson.contentUrl || "");

  const handleSave = () => {
    onUpdateContentUrl(videoUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setVideoUrl(lesson.contentUrl || "");
    setIsEditing(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            <CardTitle>Video Content</CardTitle>
          </div>
          {!isEditing && lesson.contentUrl && (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          Add or update the video URL for this lesson
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {isEditing || !lesson.contentUrl ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL of the video file or a streaming service link
              </p>
            </div>

            <div className="flex justify-end gap-2">
              {lesson.contentUrl && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} disabled={!videoUrl}>
                <Save className="h-4 w-4 mr-2" />
                Save Video URL
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
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <video
                  src={lesson.contentUrl}
                  controls
                  className="w-full h-full rounded-lg"
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
