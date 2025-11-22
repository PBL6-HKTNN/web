import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Clock, BookOpen, User } from 'lucide-react'
import type { CartItem } from '@/types/db/payment'
import { useRemoveFromCart } from '@/hooks/queries/payment-hooks'
import { formatPrice } from '@/utils/format'

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart()

  const handleRemoveFromCart = () => {
    removeFromCart(item.courseId)
  }

  if (!item.course) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Course not found</p>
              <p className="text-xs text-muted-foreground">Course ID: {item.courseId}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFromCart}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { course } = item

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Course Thumbnail */}
          <div className="w-24 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Course Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm line-clamp-2 pr-2">
                {course.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFromCart}
                disabled={isRemoving}
                className="text-destructive hover:text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {course.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {course.description}
              </p>
            )}

            {/* Course Meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              {course.instructorId && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{course.instructorId}</span>
                </div>
              )}
              {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.duration} hours</span>
                </div>
              )}
            </div>

            {/* Price and Category */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {course.categoryId && (
                  <Badge variant="secondary" className="text-xs">
                    {course.categoryId}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CartItemComponent