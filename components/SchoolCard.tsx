'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, BookOpen, Star, Users, ArrowRight, TrendingUp } from 'lucide-react'
import { School, getConfidenceLabel } from '@/lib/schools'
import { cn } from '@/lib/utils'

interface SchoolCardProps {
  school: School
  index?: number
}

const boardColors: Record<string, string> = {
  CBSE: 'bg-blue-50 text-blue-700 border-blue-100',
  ICSE: 'bg-purple-50 text-purple-700 border-purple-100',
  'State Board': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  IB: 'bg-amber-50 text-amber-700 border-amber-100',
  IGCSE: 'bg-rose-50 text-rose-700 border-rose-100',
  Other: 'bg-slate-50 text-slate-700 border-slate-100',
}

export default function SchoolCard({ school, index = 0 }: SchoolCardProps) {
  const rating = school.avg_overall || 0
  const ratingColor = rating >= 4 ? 'text-emerald-600' : rating >= 3 ? 'text-amber-500' : rating > 0 ? 'text-red-500' : 'text-slate-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/school/${school.school_id}`}>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-base leading-snug truncate group-hover:text-brand-600 transition-colors">
                {school.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-500 truncate">
                  {school.city}, {school.state}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end ml-3 flex-shrink-0">
              {rating > 0 ? (
                <>
                  <span className={cn('text-2xl font-bold', ratingColor)}>
                    {rating.toFixed(1)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={cn(
                          'w-3 h-3',
                          s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-sm text-slate-400 font-medium">New</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border',
              boardColors[school.board] || boardColors.Other
            )}>
              <BookOpen className="w-3 h-3" />
              {school.board}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
              <Users className="w-3 h-3" />
              {school.review_count} {school.review_count === 1 ? 'review' : 'reviews'}
            </span>

            {school.review_count >= 3 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-600 border border-brand-100">
                <TrendingUp className="w-3 h-3" />
                {getConfidenceLabel(school.confidence_level, school.review_count)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {rating > 0 && (
              <div className="flex-1 mr-3">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(rating / 5) * 100}%` }}
                    transition={{ delay: index * 0.06 + 0.3, duration: 0.6 }}
                    className={cn(
                      'h-full rounded-full',
                      rating >= 4 ? 'bg-emerald-400' : rating >= 3 ? 'bg-amber-400' : 'bg-red-400'
                    )}
                  />
                </div>
              </div>
            )}
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
