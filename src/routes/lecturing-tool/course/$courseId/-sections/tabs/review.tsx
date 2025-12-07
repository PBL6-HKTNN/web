// JSX runtime handles React import automatically
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ReviewList } from '@/components/review'

import type { Review } from '@/types/db/review'

interface ReviewTabProps {
  courseId: string
  reviews: Review[]
  averageRating: number
  isLoading: boolean
}

export default function ReviewTab({ courseId, reviews, averageRating, isLoading }: ReviewTabProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Student Reviews</CardTitle>
        <CardDescription>See what students are saying about this course</CardDescription>
      </CardHeader>
      <CardContent>
        <ReviewList
          courseId={courseId}
          reviews={reviews}
          averageRating={averageRating}
          isLoading={isLoading}
          showForm={false}
          formatNumber={(n) => n.toString()}
        />
      </CardContent>
    </>
  )
}
