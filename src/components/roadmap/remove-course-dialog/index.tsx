import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { useGetCourseById } from '@/hooks/queries/course/course-hooks'
import type { UUID } from '@/types'

interface RemoveCourseDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  courseId: UUID | null
  isLoading: boolean
}

export function RemoveCourseDialog({
  isOpen,
  onClose,
  onConfirm,
  courseId,
  isLoading,
}: RemoveCourseDialogProps) {
  const { data: courseData } = useGetCourseById(courseId || '')
  const course = courseData?.data

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Remove Course from Roadmap</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this course from the roadmap?
            {course && (
              <span className="block mt-2 font-semibold text-foreground">
                {course.title}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                Remove Course
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

