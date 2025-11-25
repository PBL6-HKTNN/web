import { CreateModuleDialog } from "@/components/course/course-edit/modals/create-module";
import { CreateLessonDialog } from "@/components/course/course-edit/modals/create-lesson";
import { useCourseEdit } from "@/contexts/course/use-course-edit";
import { CourseForm } from "@/components/course/course-edit/general-info";
import { CourseEditLayout } from "@/components/course/course-edit/layout";
import { ContentRender } from "@/components/course/course-edit/content-render";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { authGuard } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import { getAuthState } from "@/hooks";
import { useCourseEditing } from "./-hook";
import type { UUID } from "@/types";


export const Route = createFileRoute(
  '/lecturing-tool/course/$courseId/editing/',
)({
  component: RouteComponent,
  beforeLoad: authGuard,
})

function RouteComponent() {
  const { courseId } = Route.useParams()
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isLoading,
    setIsLoading,
  } = useCourseEditing();

  const {
    isCreateModuleOpen,
    closeCreateModule,
    isCreateLessonOpen,
    closeCreateLesson,
    selectedModuleId,
  } = useCourseEdit();
  const { user } = getAuthState();

  return (
    <>
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
        <CourseForm
          courseId={courseId}
          instructorId={user?.id as UUID}
          onSuccess={(savedCourseId) => console.log("Course saved:", savedCourseId)}
          onError={(error) => console.error("Error saving course:", error)}
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

      {/* Create Module Dialog */}
      <CreateModuleDialog
        isOpen={isCreateModuleOpen}
        onClose={closeCreateModule}
        courseId={courseId}
      />

      {/* Create Lesson Dialog */}
      {selectedModuleId && (
        <CreateLessonDialog
          isOpen={isCreateLessonOpen}
          onClose={closeCreateLesson}
          moduleId={selectedModuleId}
        />
      )}
    </>
  );
}
