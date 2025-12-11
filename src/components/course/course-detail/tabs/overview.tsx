import type { Course } from '@/types/db/course'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OverviewProps {
  course: Course
}

export default function OverviewTab({ course }: OverviewProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>About this course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{course.description}</p>
        </CardContent>
      </Card>
    </>
  )
}
