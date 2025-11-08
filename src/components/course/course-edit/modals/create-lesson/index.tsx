"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, FileText, Video, HelpCircle } from "lucide-react";
import { useCreateLessonHook } from "./hook";
import type { UUID } from "@/types";
import type { LessonType } from "@/types/db/course/lesson";

interface CreateLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: UUID;
}

interface LessonTypeOption {
  value: LessonType;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

const lessonTypeOptions: LessonTypeOption[] = [
  {
    value: 0,
    label: "Markdown Content",
    description: "Create text-based lessons with formatting support",
    icon: <FileText className="h-5 w-5" />,
    badge: "Text",
  },
  {
    value: 1,
    label: "Video Lesson",
    description: "Upload video content for visual learning",
    icon: <Video className="h-5 w-5" />,
    badge: "Video",
  },
  {
    value: 2,
    label: "Quiz",
    description: "Create interactive quizzes and assessments",
    icon: <HelpCircle className="h-5 w-5" />,
    badge: "Quiz",
  },
];

export function CreateLessonDialog({ isOpen, onClose, moduleId }: CreateLessonDialogProps) {
  const { form, handleSubmit, isLoading } = useCreateLessonHook({
    moduleId,
    onSuccess: onClose,
  });



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Add a new lesson to this module with your preferred content type.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lesson title"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lessonType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Type *</FormLabel>
                  <FormDescription>
                    Choose the type of content for this lesson
                  </FormDescription>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {lessonTypeOptions.map((option) => (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-colors ${
                          field.value === option.value
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => field.onChange(option.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {option.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm">
                                  {option.label}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {option.badge}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  field.value === option.value
                                    ? "border-primary bg-primary"
                                    : "border-gray-300"
                                }`}
                              >
                                {field.value === option.value && (
                                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 10:00"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Format: MM:SS or HH:MM:SS
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPreview"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Preview Lesson
                    </FormLabel>
                    <FormDescription>
                      Allow non-enrolled students to preview this lesson
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lesson
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}