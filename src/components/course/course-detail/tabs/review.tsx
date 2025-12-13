import { ReviewList } from '@/components/review'
import type { Review } from '@/types/db/review'

interface ReviewTabProps {
  courseId: string
  instructorId: string
  reviews: Review[]
  averageRating: number
  isLoading?: boolean
  formatNumber?: (num: number) => string
}

export default function ReviewTab({ courseId, instructorId, reviews, averageRating, isLoading = false, formatNumber = (n) => n.toString() }: ReviewTabProps) {
  return (
      <ReviewList courseId={courseId} instructorId={instructorId} reviews={reviews} averageRating={averageRating} isLoading={isLoading} formatNumber={formatNumber} />
  )
}
