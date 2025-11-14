"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Loader2, Save, Upload } from "lucide-react";
import { MediaUploadDialog } from "@/components/shared/image-upload";
import type { UUID } from "@/types";

import { useCourseForm } from "./hook";

interface CourseFormProps {
  courseId?: UUID;
  instructorId: UUID;
  onSuccess?: (courseId: UUID) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function CourseForm({
  courseId,
  instructorId,
  onSuccess,
  onError,
  className,
}: CourseFormProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { form, handleSubmit, isLoading, categories } = useCourseForm({
    courseId,
    instructorId,
    onSuccess,
    onError,
  });

  const isEditMode = !!courseId;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Course" : "Create New Course"}</CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update the information for your course."
            : "Fill in the details to create a new course."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course title"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title that explains what students will learn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter course description"
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of what students will learn and achieve.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category that best fits your course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Beginner</SelectItem>
                        <SelectItem value="1">Intermediate</SelectItem>
                        <SelectItem value="2">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The target skill level for this course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the price for your course (0 for free).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., English, Spanish, French"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The primary language of instruction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value && (
                        <div className="relative">
                          <img
                            src={field.value}
                            alt="Course thumbnail"
                            className="w-32 h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => field.onChange("")}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => setIsUploadDialogOpen(true)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {field.value ? "Change Thumbnail" : "Upload Thumbnail"}
                        </Button>
                        <MediaUploadDialog
                          accept="image/*"
                          maxSize={5}
                          title="Upload Course Thumbnail"
                          description="Select an image file for your course thumbnail."
                          onMediaUploaded={(result) => {
                            field.onChange(result.data?.url);
                            setIsUploadDialogOpen(false);
                          }}
                        />
                      </Dialog>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image for your course thumbnail. Recommended size: 1280x720px.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Update Course" : "Create Course"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
