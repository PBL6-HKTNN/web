"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Edit, Save, X, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUpdateModule } from "@/hooks/queries/course/module-hooks";
import { useToast } from "@/hooks/use-toast";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import type { Module } from "@/types/db/course/module";

interface ModuleRenderProps {
  module: Module;
}

export function ModuleRender({ module }: ModuleRenderProps) {
  const { success, error } = useToast();
  const { openDeleteModal } = useCourseEdit();
  const updateModuleMutation = useUpdateModule();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(module.title);
    setHasChanges(false);
  }, [module.title]);

  useEffect(() => {
    const titleChanged = title !== module.title;
    setHasChanges(titleChanged);
  }, [title, module.title]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    try {
      await updateModuleMutation.mutateAsync({
        moduleId: module.id,
        data: {
          title,
          courseId: module.courseId,
          order: module.order,
        },
      });
      
      success("Module updated successfully");
      setIsEditing(false);
      setHasChanges(false);
    } catch (err) {
      error(`Failed to update module: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setTitle(module.title);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleDelete = () => {
    openDeleteModal('module', module.id, module.title);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <div>
              <CardTitle>Module Information</CardTitle>
              <CardDescription>
                Edit the basic information for this module
              </CardDescription>
            </div>
          </div>
          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
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
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-title">Module Title</Label>
              <Input
                id="module-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter module title"
              />
            </div>



            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || updateModuleMutation.isPending}
              >
                {updateModuleMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Module Title</Label>
              <p className="text-sm">{module.title}</p>
            </div>



            <div className="space-y-2">
              <Label className="text-sm font-medium">Lessons</Label>
              <p className="text-sm text-muted-foreground">
                {module.lessons?.length || 0} lesson(s) in this module
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}