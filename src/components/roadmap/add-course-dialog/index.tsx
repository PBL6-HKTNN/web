import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Plus, Loader2, Check } from 'lucide-react'
import type { Course } from '@/types/db/course'
import type { UUID } from '@/types'

interface AddCourseDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedCourseIds: UUID[]
  courseSearchTerm: string
  onSearchChange: (term: string) => void
  filteredCourses: Course[]
  isLoadingCourses: boolean
  onSelectCourse: (courseId: UUID) => void
  onAdd: () => void
  isAdding: boolean
}

export function AddCourseDialog({
  isOpen,
  onClose,
  selectedCourseIds,
  courseSearchTerm,
  onSearchChange,
  filteredCourses,
  isLoadingCourses,
  onSelectCourse,
  onAdd,
  isAdding,
}: AddCourseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Courses to Add</DialogTitle>
          <DialogDescription>
            Choose one or more courses to add to this roadmap
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={courseSearchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected count */}
          {selectedCourseIds.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedCourseIds.length} course{selectedCourseIds.length !== 1 ? 's' : ''} selected
            </div>
          )}

          {/* Course List */}
          <ScrollArea className="flex-1 border rounded-md">
            {isLoadingCourses ? (
              <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading courses...
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {courseSearchTerm
                  ? 'No courses found matching your search'
                  : 'No available courses to add'}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredCourses.map((course) => {
                  const isSelected = selectedCourseIds.includes(course.id)
                  return (
                    <div
                      key={course.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-accent border-primary'
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => onSelectCourse(course.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectCourse(course.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{course.title}</div>
                        {course.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {course.description}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{course.language}</span>
                          {course.price > 0 ? (
                            <span>${course.price.toFixed(2)}</span>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAdd} disabled={isAdding || selectedCourseIds.length === 0}>
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedCourseIds.length > 0 ? `${selectedCourseIds.length} ` : ''}Course{selectedCourseIds.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

