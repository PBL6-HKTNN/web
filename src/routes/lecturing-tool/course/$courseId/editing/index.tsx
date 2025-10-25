import { useState } from "react";
import { CourseEditProvider } from "@/contexts/course/course-edit";
import { CourseGeneralInfoEdit } from "@/components/course/course-edit/general-info";
import { CourseEditLayout } from "@/components/course/course-edit/layout";
import { ContentRender } from "@/components/course/course-edit/content-render";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { authGuard } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import type { CourseGeneralInfoFormData } from "@/components/course/course-edit/general-info/hooks";

export const Route = createFileRoute(
  '/lecturing-tool/course/$courseId/editing/',
)({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Mock loading state for future API integration - can be toggled for testing

  const handleGeneralInfoSubmit = (data: CourseGeneralInfoFormData) => {
    console.log("General info submitted for course", courseId, ":", data);
    // TODO: Implement API call to save course general info
  };

  return (
    <CourseEditProvider>
      <div className="container mx-auto py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Editor</h1>
            <p className="text-muted-foreground">Edit course content and settings</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsLoading(!isLoading)} variant="outline">
              {isLoading ? "Stop Loading" : "Test Loading"}
            </Button>
            <Button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Content
            </Button>
          </div>
        </div>

        {/* Course General Information */}
        <CourseGeneralInfoEdit
          initialData={{
            title: "Sample Course Title",
            description: "This is a sample course description.",
            thumbnail: null,
          }}
          onSubmit={handleGeneralInfoSubmit}
        />

        {/* Course Content Edit Modal */}
        <CourseEditLayout
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          isLoading={isLoading}
        >
          <ContentRender />
        </CourseEditLayout>
      </div>
    </CourseEditProvider>
  );
}
