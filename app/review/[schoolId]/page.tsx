'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2, Info, Send } from 'lucide-react'
import { getSchool, School } from '@/lib/schools'
import { addReview, hasUserReviewedSchool, Ratings } from '@/lib/reviews'
import { useAuth } from '@/hooks/useAuth'
import RatingStars from '@/components/RatingStars'
import { cn } from '@/lib/utils'

const ratingCategories = [
  {
    key: 'teaching',
    label: 'Teaching Quality',
    icon: '👩‍🏫',
    desc: 'How well do teachers explain concepts?',
  },
  {
    key: 'concept_clarity',
    label: 'Concept Clarity',
    icon: '💡',
    desc: 'Are concepts taught with depth and clarity?',
  },
  {
    key: 'doubt_solving',
    label: 'Doubt Solving',
    icon: '🙋',
    desc: 'How responsive are teachers to student doubts?',
  },
  {
    key: 'homework',
    label: 'Homework Load',
    icon: '📚',
    desc: '1 = overwhelming, 5 = well-balanced',
  },
  {
    key: 'pressure',
    label: 'Academic Pressure',
    icon: '🎯',
    desc: '1 = extreme pressure, 5 = healthy environment',
  },
]

const ratingLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const schoolId = params.schoolId as string
  const { user, profile } = useAuth()

  const [school, setSchool] = useState<School | null>(null)
  const [ratings, setRatings] = useState<Ratings>({
    teaching: 0,
    concept_clarity: 0,
    doubt_solving: 0,
    homework: 0,
    pressure: 0,
  })
  const [writtenReview, setWrittenReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  useEffect(() => {
    if (!user) { router.replace('/auth'); return }
    const init = async () => {
      const [s, reviewed] = await Promise.all([
        getSchool(schoolId),
        hasUserReviewedSchool(user.uid, schoolId),
      ])
      setSchool(s)
      setAlreadyReviewed(reviewed)
      setPageLoading(false)
    }
    init()
  }, [user, schoolId, router])

  const allRated = Object.values(ratings).every(v => v > 0)
  const overallPreview = allRated
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1)
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile || !allRated) return
    setLoading(true)
    setError('')
    try {
      await addReview({
        user_id: user.uid,
        username: profile.username,
        school_id: schoolId,
        ratings,
        written_review: writtenReview,
        trust_score: profile.trust_score,
      })
      setSuccess(true)
      setTimeout(() => router.push(`/school/${schoolId}`), 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Review Submitted!</h2>
          <p className="text-slate-500">Your honest review helps students make better decisions. Thank you!</p>
          <div className="mt-4 px-4 py-2 bg-brand-50 border border-brand-100 rounded-xl inline-flex items-center gap-2">
            <span className="text-sm text-brand-700 font-medium">Your overall score: {overallPreview}★</span>
          </div>
          <p className="text-xs text-slate-400 mt-4">Redirecting to school page...</p>
        </motion.div>
      </div>
    )
  }

  if (alreadyReviewed) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Already Reviewed</h2>
          <p className="text-slate-500 text-sm mb-5">You've already submitted a review for this school.</p>
          <Link href={`/school/${schoolId}`}>
            <button className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm">
              View School Profile
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-20">
        <div className="page-container py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />Back
          </button>
          {overallPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-100 rounded-xl"
            >
              <span className="text-sm text-brand-700 font-semibold">Preview: {overallPreview}★</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="page-container py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* School name */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">
              Review: {school?.name}
            </h1>
            <p className="text-slate-500 text-sm">{school?.city}, {school?.state} · {school?.board}</p>
          </div>

          {/* Anonymous notice */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-0.5">Your review is anonymous</p>
              <p className="text-xs text-emerald-700">
                Only your username is visible. Be honest — your experience helps others make informed decisions.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating categories */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card space-y-6">
              <h2 className="font-semibold text-slate-900 text-base">Rate each category</h2>
              {ratingCategories.map(({ key, label, icon, desc }) => {
                const val = ratings[key as keyof Ratings]
                return (
                  <div key={key}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>{icon}</span>
                          <span className="font-medium text-slate-800 text-sm">{label}</span>
                        </div>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      <div className="text-right ml-4">
                        <RatingStars
                          value={val}
                          onChange={(v) => setRatings(r => ({ ...r, [key]: v }))}
                          size="lg"
                        />
                        <AnimatePresence mode="wait">
                          {val > 0 && (
                            <motion.p
                              key={val}
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={cn(
                                'text-xs font-semibold mt-1',
                                val >= 4 ? 'text-emerald-600' : val >= 3 ? 'text-amber-600' : 'text-red-600'
                              )}
                            >
                              {ratingLabels[val]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                      <motion.div
                        animate={{ width: val ? `${(val / 5) * 100}%` : '0%' }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          'h-full rounded-full',
                          val >= 4 ? 'bg-emerald-400' : val >= 3 ? 'bg-amber-400' : val > 0 ? 'bg-red-400' : ''
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Written review */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-card">
              <h2 className="font-semibold text-slate-900 text-base mb-1">Written Review</h2>
              <p className="text-xs text-slate-500 mb-4">
                Optional but recommended — detailed reviews earn higher trust scores
              </p>
              <textarea
                value={writtenReview}
                onChange={e => setWrittenReview(e.target.value)}
                rows={5}
                placeholder="Share your experience about the teaching quality, atmosphere, how teachers handle doubts, peer pressure, or anything a future student should know..."
                maxLength={1000}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-400">
                  {writtenReview.length > 100 && (
                    <span className="text-emerald-600 font-medium">✓ Detailed reviews boost your trust score</span>
                  )}
                </p>
                <span className="text-xs text-slate-400">{writtenReview.length}/1000</span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || !allRated}
              whileHover={allRated ? { scale: 1.01 } : {}}
              whileTap={allRated ? { scale: 0.99 } : {}}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
              ) : (
                <><Send className="w-5 h-5" />Submit Review</>
              )}
            </motion.button>

            {!allRated && (
              <p className="text-center text-sm text-slate-400">
                Please rate all 5 categories to submit
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
