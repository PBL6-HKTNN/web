import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus } from 'lucide-react'
import { CourseItem } from '../course-item'
import type { UUID } from '@/types'
import type { RoadmapDetail } from '@/types/db/roadmap'

interface RoadmapCoursesListProps {
  roadmap: RoadmapDetail
  courseIds: UUID[]
  onAddCourse: () => void
  onRemoveCourse: (courseId: UUID) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
}

export function RoadmapCoursesList({
  roadmap,
  courseIds,
  onAddCourse,
  onRemoveCourse,
  onMoveUp,
  onMoveDown,
}: RoadmapCoursesListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Courses ({courseIds.length})
            </CardTitle>
            <CardDescription>
              {roadmap.isOwner
                ? 'Drag courses to reorder them'
                : 'Courses in this learning roadmap'}
            </CardDescription>
          </div>
          {roadmap.isOwner && (
            <Button onClick={onAddCourse} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {courseIds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No courses in this roadmap yet</p>
            {roadmap.isOwner && (
              <Button onClick={onAddCourse} className="mt-4" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Course
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {courseIds.map((courseId, index) => (
              <CourseItem
                key={courseId}
                courseId={courseId}
                index={index}
                totalCourses={courseIds.length}
                onRemove={onRemoveCourse}
                onMoveUp={() => onMoveUp(index)}
                onMoveDown={() => onMoveDown(index)}
                isOwner={roadmap.isOwner}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

