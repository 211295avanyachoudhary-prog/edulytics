import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] rounded-xl',
        className
      )}
      style={{ animation: 'shimmer 1.5s infinite' }}
    />
  )
}

export function SchoolCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-12 ml-3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-1.5 w-full mt-4" />
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5 mt-1" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-card flex items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <div className="flex-1">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[...Array(2)].map((_, i) => <ReviewCardSkeleton key={i} />)}
      </div>
    </div>
  )
}
