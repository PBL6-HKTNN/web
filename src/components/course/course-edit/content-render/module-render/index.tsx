"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Edit, Save, X, BookOpen } from "lucide-react";
import type { ModuleReq } from "@/types/db/course/module";
import { useModuleRender } from "./hooks";

interface ModuleRenderProps {
  module: ModuleReq;
}

export function ModuleRender({ module }: ModuleRenderProps) {
  const { isEditing, form, handleEdit, handleCancel, handleSave } = useModuleRender(module);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Module Information</CardTitle>
          </div>
          {!isEditing && (
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>
          View and edit the module details
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter module title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Module order"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
              <p className="text-base">{module.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Order</h3>
              <p className="text-base">{module.order}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Number of Lessons</h3>
              <p className="text-base">{module.lessons.length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
