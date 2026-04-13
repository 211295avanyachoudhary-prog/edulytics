'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2, CheckCircle2, Building2, Star, ExternalLink,
  PenLine, Send, MapPin, BookOpen, Users, ArrowRight,
} from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { findSchoolByDetails } from '@/lib/schoolLookup'
import { addSchool, School } from '@/lib/schools'
import { addReview, hasUserReviewedSchool, Ratings } from '@/lib/reviews'
import { useAuth } from '@/hooks/useAuth'
import RatingStars from '@/components/RatingStars'
import StepShell from '../StepShell'
import { NextButton } from '../FormParts'
import { cn } from '@/lib/utils'

type PageState = 'loading' | 'found-existing' | 'new-school' | 'reviewing' | 'done' | 'already-reviewed'

const ratingCategories = [
  { key: 'teaching', label: 'Teaching Quality', icon: '👩‍🏫', desc: 'How well teachers explain' },
  { key: 'concept_clarity', label: 'Concept Clarity', icon: '💡', desc: 'Depth and clarity of concepts' },
  { key: 'doubt_solving', label: 'Doubt Solving', icon: '🙋', desc: 'How doubts are handled' },
  { key: 'homework', label: 'Homework Load', icon: '📚', desc: '1 = Too much, 5 = Balanced' },
  { key: 'pressure', label: 'Academic Pressure', icon: '🎯', desc: '1 = Extreme, 5 = Healthy' },
]

const ratingWords: Record<number, string> = { 1: 'Poor', 2: 'Below avg', 3: 'Average', 4: 'Good', 5: 'Excellent' }

export default function ReviewSchoolPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const { state, setResolvedSchoolId, getSchoolDetails } = useOnboarding()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [school, setSchool] = useState<School | null>(null)
  const [creatingSchool, setCreatingSchool] = useState(false)

  const [ratings, setRatings] = useState<Ratings>({
    teaching: 0, concept_clarity: 0, doubt_solving: 0, homework: 0, pressure: 0,
  })
  const [writtenReview, setWrittenReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Redirect to auth if not logged in, return here after
  useEffect(() => {
    if (!user) router.replace('/auth?returnTo=/onboarding/review-school&mode=signup')
  }, [user, router])

  // Look up school on mount
  useEffect(() => {
    if (!user) return
    const details = getSchoolDetails()
    if (!details || !details.name) {
      router.replace('/onboarding')
      return
    }
    const lookup = async () => {
      const found = await findSchoolByDetails(details.name, details.city, details.state)
      if (found) {
        setSchool(found)
        setResolvedSchoolId(found.school_id)
        // Check if user already reviewed
        const already = await hasUserReviewedSchool(user.uid, found.school_id)
        setPageState(already ? 'already-reviewed' : 'found-existing')
      } else {
        setPageState('new-school')
      }
    }
    lookup()
  }, [user]) // eslint-disable-line

  const details = getSchoolDetails()

  const handleCreateAndReview = async () => {
    if (!user || !details) return
    setCreatingSchool(true)
    try {
      const newSchool = await addSchool({
        name: details.name,
        city: details.city,
        state: details.state,
        board: details.board,
        created_by: user.uid,
      })
      setSchool(newSchool)
      setResolvedSchoolId(newSchool.school_id)
      setPageState('reviewing')
    } catch (err: unknown) {
      // If duplicate (race condition), try lookup again
      const found = await findSchoolByDetails(details.name, details.city, details.state)
      if (found) {
        setSchool(found)
        setResolvedSchoolId(found.school_id)
        setPageState('found-existing')
      }
    } finally {
      setCreatingSchool(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !profile || !school) return
    if (Object.values(ratings).some(v => v === 0)) {
      setSubmitError('Please rate all 5 categories')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await addReview({
        user_id: user.uid,
        username: profile.username,
        school_id: school.school_id,
        ratings,
        written_review: writtenReview,
        trust_score: profile.trust_score,
      })
      setPageState('done')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const allRated = Object.values(ratings).every(v => v > 0)
  const overallPreview = allRated
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1)
    : null

  // ─── LOADING ───────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <StepShell step={4} totalSteps={4} title="Finding your school..." subtitle="Searching our database...">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          </div>
          {details && (
            <div className="text-center">
              <p className="text-white font-semibold">{details.name}</p>
              <p className="text-white/50 text-sm">{details.city}, {details.state}</p>
            </div>
          )}
        </div>
      </StepShell>
    )
  }

  // ─── DONE ──────────────────────────────────────────────────────────────────
  if (pageState === 'done') {
    return (
      <StepShell step={4} totalSteps={4} title="Review submitted!" subtitle="Thank you for contributing to honest education.">
        <div className="flex flex-col items-center gap-5 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          {overallPreview && (
            <div className="text-center">
              <p className="text-white/60 text-sm mb-1">Your overall score</p>
              <p className="text-5xl font-bold text-white">{overallPreview}<span className="text-amber-400 text-2xl">★</span></p>
            </div>
          )}
          <div className="w-full space-y-3 pt-2">
            {school && (
              <Link href={`/school/${school.school_id}`}>
                <button className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-white text-slate-900 hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg">
                  <ExternalLink className="w-4 h-4" />
                  View School Profile
                </button>
              </Link>
            )}
            <Link href="/dashboard">
              <button className="w-full py-3 rounded-2xl font-semibold text-sm bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </StepShell>
    )
  }

  // ─── ALREADY REVIEWED ──────────────────────────────────────────────────────
  if (pageState === 'already-reviewed') {
    return (
      <StepShell step={4} totalSteps={4} emoji="⭐" title="You've already reviewed this school"
        subtitle="Each school can only be reviewed once per user to maintain integrity.">
        <div className="space-y-3">
          {school && (
            <div className="bg-white/8 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{school.name}</p>
                <p className="text-white/50 text-xs">{school.city}, {school.state}</p>
              </div>
              {school.avg_overall > 0 && (
                <span className="ml-auto text-amber-400 font-bold text-lg">{school.avg_overall.toFixed(1)}★</span>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {school && (
              <Link href={`/school/${school.school_id}`}>
                <button className="w-full py-3 rounded-2xl text-sm font-semibold bg-brand-500/20 border border-brand-400/30 text-brand-300 hover:bg-brand-500/30 transition-all flex items-center justify-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />View Profile
                </button>
              </Link>
            )}
            <Link href="/dashboard">
              <button className="w-full py-3 rounded-2xl text-sm font-semibold bg-white/8 border border-white/10 text-white/70 hover:bg-white/12 transition-all">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </StepShell>
    )
  }

  // ─── EXISTING SCHOOL FOUND ─────────────────────────────────────────────────
  if (pageState === 'found-existing' && school) {
    return (
      <StepShell step={4} totalSteps={4} title="We found your school!" subtitle="This school is already in Edulytics. You can review it now.">
        {/* School card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/8 border border-white/15 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/20 border border-brand-400/30 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-brand-300" />
              </div>
              <div>
                <p className="font-bold text-white">{school.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-white/40" />
                  <p className="text-white/50 text-xs">{school.city}, {school.state}</p>
                </div>
              </div>
            </div>
            {school.avg_overall > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-400">{school.avg_overall.toFixed(1)}</p>
                <p className="text-white/40 text-xs">avg rating</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-white/60 text-xs">
              <BookOpen className="w-3 h-3" />{school.board}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-white/60 text-xs">
              <Users className="w-3 h-3" />{school.review_count} reviews
            </span>
            <span className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium',
              'bg-emerald-500/15 border border-emerald-400/30 text-emerald-400'
            )}>
              ✓ Already in Edulytics
            </span>
          </div>
        </motion.div>

        <div className="space-y-3">
          <button
            onClick={() => setPageState('reviewing')}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 transition-all flex items-center justify-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            Write a Review Now
          </button>

          <Link href={`/school/${school.school_id}`}>
            <button className="w-full py-3 rounded-2xl font-semibold text-sm bg-white/8 border border-white/15 text-white/80 hover:bg-white/12 transition-all flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Just view the school profile
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="w-full py-2.5 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors text-center">
              Skip & go to dashboard
            </button>
          </Link>
        </div>
      </StepShell>
    )
  }

  // ─── NEW SCHOOL (not in DB yet) ────────────────────────────────────────────
  if (pageState === 'new-school') {
    return (
      <StepShell step={4} totalSteps={4} title="School not found yet"
        subtitle="This school isn't in our database. Add it and be the first to review it!">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-5 mb-5"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🏫</span>
            <div>
              <p className="font-bold text-white text-sm">{details?.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{details?.city}, {details?.state} · {details?.board}</p>
              <p className="text-amber-300 text-xs mt-2 font-medium">Not yet listed on Edulytics</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          <NextButton onClick={handleCreateAndReview} loading={creatingSchool}>
            Add School & Write First Review →
          </NextButton>
          <Link href="/dashboard">
            <button className="w-full py-2.5 rounded-xl text-xs text-white/40 hover:text-white/60 transition-colors text-center">
              Skip & go to dashboard
            </button>
          </Link>
        </div>
      </StepShell>
    )
  }

  // ─── REVIEW FORM ───────────────────────────────────────────────────────────
  if (pageState === 'reviewing' && school) {
    return (
      <StepShell step={4} totalSteps={4} title="Rate your school"
        subtitle="Your honest, anonymous review helps thousands of students make better decisions."
        onBack={() => setPageState('found-existing')}>
        <div className="space-y-5">
          {/* School chip */}
          <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5">
            <Building2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <span className="text-white font-medium text-sm truncate">{school.name}</span>
            <span className="text-white/40 text-xs ml-auto flex-shrink-0">{school.city}</span>
          </div>

          {/* Live overall preview */}
          <AnimatePresence>
            {overallPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 bg-brand-500/15 border border-brand-400/30 rounded-2xl py-3"
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-semibold">Overall: <span className="text-amber-400 text-lg font-bold">{overallPreview}</span> / 5</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rating categories */}
          <div className="space-y-4">
            {ratingCategories.map(({ key, label, icon, desc }) => {
              const val = ratings[key as keyof Ratings]
              return (
                <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium text-sm flex items-center gap-1.5">
                        <span>{icon}</span>{label}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">{desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <RatingStars
                        value={val}
                        onChange={(v) => setRatings(r => ({ ...r, [key]: v }))}
                        size="lg"
                      />
                      <AnimatePresence mode="wait">
                        {val > 0 && (
                          <motion.span
                            key={val}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                              'text-xs font-semibold',
                              val >= 4 ? 'text-emerald-400' : val >= 3 ? 'text-amber-400' : 'text-red-400'
                            )}
                          >
                            {ratingWords[val]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* Mini progress */}
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2">
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
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Written Review <span className="text-white/35 font-normal">(optional, but boosts your trust score)</span>
            </label>
            <textarea
              value={writtenReview}
              onChange={e => setWrittenReview(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Share your honest experience about teaching quality, academic pressure, doubt solving, facilities, or anything a future student should know..."
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400/50 transition-all resize-none"
            />
            <div className="flex items-center justify-between mt-1.5">
              {writtenReview.length > 100
                ? <span className="text-emerald-400 text-xs font-medium">✓ Detailed review — boosts your trust score</span>
                : <span className="text-white/30 text-xs">Write more than 100 chars for a trust score boost</span>
              }
              <span className="text-white/30 text-xs">{writtenReview.length}/1000</span>
            </div>
          </div>

          {submitError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-4 py-3 rounded-xl"
            >
              {submitError}
            </motion.p>
          )}

          <NextButton
            onClick={handleSubmitReview}
            loading={submitting}
            disabled={!allRated || submitting}
          >
            <Send className="w-4 h-4" />
            Submit Anonymous Review
          </NextButton>

          {!allRated && (
            <p className="text-center text-white/35 text-xs">Rate all 5 categories to submit</p>
          )}
        </div>
      </StepShell>
    )
  }

  return null
}
