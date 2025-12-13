import { Button } from '@/components/ui/button'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useAddToCart, useGetCart } from '@/hooks/queries/payment-hooks'
import type { UUID } from '@/types'
import { useMemo } from 'react'

interface AddToCartButtonProps {
  courseId: UUID
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showText?: boolean
}

export function AddToCartButton({
  courseId,
  variant = 'default',
  size = 'default',
  className,
  showText = true
}: AddToCartButtonProps) {
  const { mutate: addToCart, isPending: isAdding } = useAddToCart()
  const { data: cartData } = useGetCart()

  // Check if course is already in cart
  const isInCart = useMemo(() => {
    const cartItems = cartData?.data?.items || []
    return cartItems.some(item => item.courseId === courseId)
  }, [cartData?.data?.items, courseId])

  const handleAddToCart = () => {
    if (isInCart || isAdding) return
    addToCart(courseId)
  }

  if (isInCart) {
    return (
      <Button
        variant="outline"
        size={size}
        className={className}
        disabled
      >
        <Check className="h-4 w-4" />
        {showText && <span className="ml-2">In Cart</span>}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </span>
      )}
    </Button>
  )
}

export default AddToCartButton