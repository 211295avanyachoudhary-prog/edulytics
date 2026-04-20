'use client'
import { motion } from 'framer-motion'
import { User, Calendar, Shield } from 'lucide-react'
import { Review } from '@/lib/reviews'
import RatingStars from './RatingStars'
import { formatDate, cn } from '@/lib/utils'

const CAT: Record<string,string> = { teaching:'Teaching', concept_clarity:'Clarity', doubt_solving:'Doubts', homework:'Homework', pressure:'Pressure' }

export default function ReviewCard({ review, index = 0 }: { review: Review; index?: number }) {
  const overall = Object.values(review.ratings).reduce((a,b) => a+b, 0) / 5
  const trusted = review.trust_score >= 1.5

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.07, duration:0.4 }}
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">{review.username || 'Anonymous'}</span>
              {trusted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  <Shield className="w-2.5 h-2.5" />Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{formatDate(review.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-800">{overall.toFixed(1)}</div>
          <RatingStars value={Math.round(overall)} size="sm" readonly />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {Object.entries(review.ratings).map(([key, val]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-slate-400 mb-1 truncate">{CAT[key]}</div>
            <div className={cn('text-sm font-bold', val>=4?'text-emerald-600':val>=3?'text-amber-500':'text-red-500')}>{val}</div>
            <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
              <div className={cn('h-full rounded-full', val>=4?'bg-emerald-400':val>=3?'bg-amber-400':'bg-red-400')} style={{ width:`${(val/5)*100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {review.written_review && (
        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3 italic">
          "{review.written_review}"
        </p>
      )}
    </motion.div>
  )
}
