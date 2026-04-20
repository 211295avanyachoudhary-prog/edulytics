'use client'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { value: number; onChange?: (v: number) => void; size?: 'sm'|'md'|'lg'; readonly?: boolean }

export default function RatingStars({ value, onChange, size = 'md', readonly = false }: Props) {
  const sz = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }[size]
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => !readonly && onChange?.(s)} disabled={readonly}
          className={cn('transition-transform', !readonly && 'hover:scale-125 cursor-pointer', readonly && 'cursor-default')}>
          <Star className={cn(sz, 'transition-colors', s <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200')} />
        </button>
      ))}
    </div>
  )
}
