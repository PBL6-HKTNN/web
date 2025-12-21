import { createFileRoute } from '@tanstack/react-router'
import { useMyRoadmaps, useCreateRoadmap, useDeleteRoadmap } from '@/hooks/queries/roadmap-hooks'
import {
  RoadmapListHeader,
  RoadmapsGrid,
  CreateRoadmapDialog,
  CourseSelectionDialog,
  DeleteRoadmapDialog,
  useRoadmapList,
} from '@/components/roadmap/roadmaplist'

export const Route = createFileRoute('/roadmap/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: roadmapsData, isLoading } = useMyRoadmaps()
  const createRoadmapMutation = useCreateRoadmap()
  const deleteRoadmapMutation = useDeleteRoadmap()

  const roadmaps = roadmapsData?.data?.roadmaps || []

  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isCourseSelectDialogOpen,
    courseSearchTerm,
    setCourseSearchTerm,
    createForm,
    setCreateForm,
    courses,
    filteredCourses,
    isLoadingCourses,
    handleSelectCourse,
    handleRemoveCourse,
    handleCreateRoadmap,
    handleOpenCourseSelect,
    handleCloseCourseSelect,
    handleDoneCourseSelect,
    isDeleteRoadmapDialogOpen,
    setIsDeleteRoadmapDialogOpen,
    roadmapToDelete,
    handleDeleteRoadmap,
    confirmDeleteRoadmap,
  } = useRoadmapList(deleteRoadmapMutation, roadmaps)

  const handleCreate = async () => {
    await handleCreateRoadmap(async (form) => {
      await createRoadmapMutation.mutateAsync(form)
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <RoadmapListHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

      {/* Roadmaps Grid */}
      <RoadmapsGrid
        isLoading={isLoading}
        roadmaps={roadmaps}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        onDelete={handleDeleteRoadmap}
      />

      {/* Create Roadmap Dialog */}
      <CreateRoadmapDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        form={createForm}
        onFormChange={setCreateForm}
        courses={courses}
        onSelectCourses={handleOpenCourseSelect}
        onRemoveCourse={handleRemoveCourse}
        onCreate={handleCreate}
        isLoading={createRoadmapMutation.isPending}
      />

      {/* Course Selection Dialog */}
      <CourseSelectionDialog
        isOpen={isCourseSelectDialogOpen}
        onOpenChange={handleCloseCourseSelect}
        courseSearchTerm={courseSearchTerm}
        onSearchChange={setCourseSearchTerm}
        filteredCourses={filteredCourses}
        selectedCourseIds={createForm.courseIds}
        isLoadingCourses={isLoadingCourses}
        onSelectCourse={handleSelectCourse}
        onDone={handleDoneCourseSelect}
      />

      {/* Delete Roadmap Dialog */}
      <DeleteRoadmapDialog
        isOpen={isDeleteRoadmapDialogOpen}
        onClose={() => setIsDeleteRoadmapDialogOpen(false)}
        onConfirm={confirmDeleteRoadmap}
        roadmap={roadmapToDelete}
        isLoading={deleteRoadmapMutation.isPending}
      />
    </div>
  )
}
