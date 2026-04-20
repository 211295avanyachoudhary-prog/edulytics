import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-xl', className)} />
}

export function SchoolCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card space-y-3">
      <div className="flex justify-between"><div className="space-y-2 flex-1"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div><Skeleton className="h-10 w-12 ml-3" /></div>
      <div className="flex gap-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-20" /></div>
      <Skeleton className="h-2 w-full" />
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
      <div className="flex gap-3"><Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div><Skeleton className="h-8 w-16" /></div>
      <div className="grid grid-cols-5 gap-2">{[...Array(5)].map((_,i) => <Skeleton key={i} className="h-8" />)}</div>
      <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" />
    </div>
  )
}
