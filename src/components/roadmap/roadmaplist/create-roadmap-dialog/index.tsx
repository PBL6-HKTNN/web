import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Loader2, X } from 'lucide-react'
import type { CreateRoadmapReq } from '@/types/db/roadmap'
import type { Course } from '@/types/db/course'

interface CreateRoadmapDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  form: CreateRoadmapReq
  onFormChange: (form: CreateRoadmapReq) => void
  courses: Course[]
  onSelectCourses: () => void
  onRemoveCourse: (courseId: string) => void
  onCreate: () => void
  isLoading: boolean
}

export function CreateRoadmapDialog({
  isOpen,
  onOpenChange,
  form,
  onFormChange,
  courses,
  onSelectCourses,
  onRemoveCourse,
  onCreate,
  isLoading,
}: CreateRoadmapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Roadmap</DialogTitle>
          <DialogDescription>
            Create a new learning roadmap to organize your courses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Full Stack Web Development"
              value={form.title}
              onChange={(e) =>
                onFormChange({ ...form, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your learning roadmap..."
              value={form.description}
              onChange={(e) =>
                onFormChange({ ...form, description: e.target.value })
              }
              rows={4}
              className={
                form.description.trim().length > 0 &&
                form.description.trim().length <= 10
                  ? 'border-destructive'
                  : ''
              }
            />
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Description must be more than 10 characters
              </p>
              <span
                className={
                  form.description.trim().length <= 10
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                }
              >
                {form.description.trim().length} / 10+
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Courses *</Label>
            <p className="text-sm text-muted-foreground">
              At least one course is required to create a roadmap
            </p>
            {form.courseIds.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.courseIds.map((courseId) => {
                  const course = courses.find((c) => c.id === courseId)
                  return (
                    <Badge
                      key={courseId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {course?.title || courseId}
                      <button
                        type="button"
                        onClick={() => onRemoveCourse(courseId)}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSelectCourses}
              className="w-full mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              {form.courseIds.length > 0
                ? 'Add More Courses'
                : 'Select Courses'}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Roadmap
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

