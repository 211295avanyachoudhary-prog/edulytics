'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, BookOpen, Users, Star, TrendingUp, Shield, ArrowLeft,
  PenLine, Info, ChevronRight, BarChart3
} from 'lucide-react'
import { getSchool, School, getConfidenceLabel } from '@/lib/schools'
import { getSchoolReviews, hasUserReviewedSchool, Review, getRatingLabel } from '@/lib/reviews'
import { useAuth } from '@/hooks/useAuth'
import ReviewCard from '@/components/ReviewCard'
import RatingStars from '@/components/RatingStars'
import { ReviewCardSkeleton } from '@/components/Skeleton'
import { cn } from '@/lib/utils'

const categoryKeys = [
  { key: 'avg_teaching', label: 'Teaching Quality', icon: '👩‍🏫' },
  { key: 'avg_concept_clarity', label: 'Concept Clarity', icon: '💡' },
  { key: 'avg_doubt_solving', label: 'Doubt Solving', icon: '🙋' },
  { key: 'avg_homework', label: 'Homework Load', icon: '📚' },
  { key: 'avg_pressure', label: 'Academic Pressure', icon: '🎯' },
]

export default function SchoolProfilePage() {
  const params = useParams()
  const router = useRouter()
  const schoolId = params.id as string
  const { user } = useAuth()

  const [school, setSchool] = useState<School | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [hasReviewed, setHasReviewed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [s, r] = await Promise.all([getSchool(schoolId), getSchoolReviews(schoolId)])
        setSchool(s)
        setReviews(r)
        if (user) {
          const reviewed = await hasUserReviewedSchool(user.uid, schoolId)
          setHasReviewed(reviewed)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [schoolId, user])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-surface-50">
        <div className="h-48 bg-gradient-to-br from-slate-900 to-brand-900 animate-pulse" />
        <div className="page-container py-8 space-y-4">
          {[...Array(3)].map((_, i) => <ReviewCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">School not found</h2>
          <Link href="/school/select" className="text-brand-600 hover:underline">Browse all schools</Link>
        </div>
      </div>
    )
  }

  const rating = school.avg_overall
  const ratingColor = rating >= 4 ? 'text-emerald-400' : rating >= 3 ? 'text-amber-400' : rating > 0 ? 'text-red-400' : 'text-slate-400'
  const confidenceColor = school.confidence_level === 'high' ? 'bg-emerald-500' : school.confidence_level === 'medium' ? 'bg-amber-500' : 'bg-slate-400'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 pb-8 pt-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-800/15 rounded-full blur-3xl" />
        </div>
        <div className="page-container relative z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />Back
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-medium">
                  {school.board}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${confidenceColor}`} />
                  {getConfidenceLabel(school.confidence_level, school.review_count)}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{school.name}</h1>
              <div className="flex items-center gap-1.5 text-white/60">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{school.city}, {school.state}</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center min-w-[160px]">
              {rating > 0 ? (
                <>
                  <div className={`text-5xl font-bold ${ratingColor} mb-1`}>{rating.toFixed(1)}</div>
                  <RatingStars value={Math.round(rating)} size="md" readonly />
                  <p className="text-white/70 text-sm mt-1.5">{getRatingLabel(rating)}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {school.review_count} {school.review_count === 1 ? 'review' : 'reviews'}
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">No reviews yet</p>
                  <p className="text-white/40 text-xs">Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Stats + Write review */}
          <div className="lg:col-span-1 space-y-5">
            {/* Category breakdown */}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-6 shadow-card border border-slate-50"
              >
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <h2 className="font-semibold text-slate-900">Category Breakdown</h2>
                </div>
                <div className="space-y-4">
                  {categoryKeys.map(({ key, label, icon }) => {
                    const val = Number((school as any)[key]) || 0
                    const pct = (val / 5) * 100
                    const barColor = val >= 4 ? 'bg-emerald-400' : val >= 3 ? 'bg-amber-400' : 'bg-red-400'
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-600 flex items-center gap-1.5">
                            <span>{icon}</span>{label}
                          </span>
                          <span className={cn(
                            'text-sm font-bold',
                            val >= 4 ? 'text-emerald-600' : val >= 3 ? 'text-amber-600' : 'text-red-600'
                          )}>
                            {val.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Trust info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Trust-Weighted Score</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scores are calculated using our weighted algorithm: Σ(rating × trust_score) / Σ(trust_score). 
                    High-trust reviewers have more impact.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Write review CTA */}
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {hasReviewed ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                      <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-800">You've reviewed this school</p>
                    <p className="text-xs text-emerald-600 mt-1">Thank you for contributing!</p>
                  </div>
                ) : (
                  <Link href={`/review/${schoolId}`}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <h3 className="font-semibold text-sm mb-0.5">Review this school</h3>
                          <p className="text-white/70 text-xs">Share your honest experience</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <PenLine className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            ) : (
              <Link href="/auth">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-slate-900 rounded-2xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">Sign in to review</h3>
                      <p className="text-white/60 text-xs">Join the community</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/60" />
                  </div>
                </motion.div>
              </Link>
            )}

            {/* School info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card space-y-3"
            >
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                School Info
              </h3>
              {[
                { label: 'Board', value: school.board, icon: BookOpen },
                { label: 'City', value: school.city, icon: MapPin },
                { label: 'State', value: school.state, icon: MapPin },
                { label: 'Total Reviews', value: school.review_count, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-2 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                  <span className="text-sm font-medium text-slate-800">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Reviews */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Student Reviews
                {reviews.length > 0 && (
                  <span className="text-sm font-normal text-slate-500">({reviews.length})</span>
                )}
              </h2>
            </div>

            {reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <PenLine className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">No reviews yet</h3>
                <p className="text-slate-500 text-sm mb-5">Be the first student to share the truth about this school.</p>
                {user && !hasReviewed && (
                  <Link href={`/review/${schoolId}`}>
                    <button className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm hover:bg-brand-700 transition-colors">
                      Write First Review
                    </button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <ReviewCard key={review.review_id} review={review} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
