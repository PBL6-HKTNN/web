import { useRoadmapDetailComponent } from './hook'
import { RoadmapHeader } from '../roadmap-header'
import { RoadmapCoursesList } from '../roadmap-courses-list'
import { EditRoadmapDialog } from '../edit-roadmap-dialog'
import { AddCourseDialog } from '../add-course-dialog'
import { RemoveCourseDialog } from '../remove-course-dialog'
import { DeleteRoadmapDialog } from '../delete-roadmap-dialog'
import { useEditRoadmapDialog } from '../edit-roadmap-dialog/hooks'
import { useAddCourseDialog } from '../add-course-dialog/hooks'
import { useRemoveCourseDialog } from '../remove-course-dialog/hooks'
import { useDeleteRoadmapDialog } from '../delete-roadmap-dialog/hooks'
import { useRoadmapCoursesList } from '../roadmap-courses-list/hooks'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { UUID } from '@/types'

interface RoadmapDetailProps {
  roadmapId: UUID
}

export function RoadmapDetail({ roadmapId }: RoadmapDetailProps) {
  const queryClient = useQueryClient()
  const { roadmap, isLoading, error } = useRoadmapDetailComponent(roadmapId)

  // Refresh roadmap data after mutations
  const refreshRoadmap = () => {
    queryClient.invalidateQueries({ queryKey: ['roadmap', roadmapId] })
  }

  // Hooks for each component
  const editDialog = useEditRoadmapDialog(roadmapId, roadmap, refreshRoadmap)
  const addCourseDialog = useAddCourseDialog(roadmapId, roadmap, refreshRoadmap)
  const removeCourseDialog = useRemoveCourseDialog(roadmapId, refreshRoadmap)
  const deleteRoadmapDialog = useDeleteRoadmapDialog(roadmapId)
  const coursesList = useRoadmapCoursesList(roadmapId, roadmap)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Failed to load roadmap. Please try again.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <RoadmapHeader
        roadmap={roadmap}
        onEdit={editDialog.handleOpen}
        onAddCourse={addCourseDialog.handleOpen}
        onDelete={deleteRoadmapDialog.handleDelete}
      />

      {/* Courses Section */}
      <RoadmapCoursesList
        roadmap={roadmap}
        courseIds={coursesList.courseIds}
        onAddCourse={addCourseDialog.handleOpen}
        onRemoveCourse={removeCourseDialog.handleRemoveCourse}
        onMoveUp={coursesList.handleMoveUp}
        onMoveDown={coursesList.handleMoveDown}
      />

      {/* Edit Roadmap Dialog */}
      <EditRoadmapDialog
        isOpen={editDialog.isOpen}
        onOpenChange={editDialog.setIsOpen}
        editForm={editDialog.editForm}
        onFormChange={editDialog.setEditForm}
        onUpdate={editDialog.handleUpdate}
        isLoading={editDialog.isLoading}
      />

      {/* Add Course Dialog */}
      <AddCourseDialog
        isOpen={addCourseDialog.isOpen}
        onClose={addCourseDialog.handleClose}
        selectedCourseIds={addCourseDialog.selectedCourseIds}
        courseSearchTerm={addCourseDialog.courseSearchTerm}
        onSearchChange={addCourseDialog.setCourseSearchTerm}
        filteredCourses={addCourseDialog.filteredCourses}
        isLoadingCourses={addCourseDialog.isLoadingCourses}
        onSelectCourse={addCourseDialog.handleSelectCourse}
        onAdd={addCourseDialog.handleAddCourse}
        isAdding={addCourseDialog.isAdding}
      />

      {/* Remove Course Dialog */}
      <RemoveCourseDialog
        isOpen={removeCourseDialog.isOpen}
        onClose={removeCourseDialog.handleClose}
        onConfirm={removeCourseDialog.confirmRemoveCourse}
        courseId={removeCourseDialog.courseIdToRemove}
        isLoading={removeCourseDialog.isLoading}
      />

      {/* Delete Roadmap Dialog */}
      <DeleteRoadmapDialog
        isOpen={deleteRoadmapDialog.isOpen}
        onClose={deleteRoadmapDialog.handleClose}
        onConfirm={deleteRoadmapDialog.confirmDeleteRoadmap}
        roadmap={roadmap}
        isLoading={deleteRoadmapDialog.isLoading}
      />
    </div>
  )
}
