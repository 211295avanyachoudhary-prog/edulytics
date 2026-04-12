'use client'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (val: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}

export default function RatingStars({ value, onChange, size = 'md', readonly = false }: RatingStarsProps) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={cn(
            'transition-all duration-150',
            !readonly && 'hover:scale-125 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizes[size],
              'transition-colors duration-150',
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-100 text-slate-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
