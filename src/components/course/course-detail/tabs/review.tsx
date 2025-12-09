import { ReviewList } from '@/components/review'
import type { Review } from '@/types/db/review'

interface ReviewTabProps {
  courseId: string
  reviews: Review[]
  averageRating: number
  isLoading?: boolean
  formatNumber?: (num: number) => string
}

export default function ReviewTab({ courseId, reviews, averageRating, isLoading = false, formatNumber = (n) => n.toString() }: ReviewTabProps) {
  return (
      <ReviewList courseId={courseId} reviews={reviews} averageRating={averageRating} isLoading={isLoading} formatNumber={formatNumber} />
  )
}
