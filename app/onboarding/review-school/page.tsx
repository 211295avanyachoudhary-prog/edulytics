'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle2, Building2, Star, ExternalLink, PenLine, Send, MapPin, BookOpen, Users } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { findSchoolByDetails, addSchool, School } from '@/lib/schools'
import { addReview, hasUserReviewedSchool, Ratings } from '@/lib/reviews'
import { useAuth } from '@/hooks/useAuth'
import RatingStars from '@/components/RatingStars'
import StepShell from '../StepShell'
import { cn } from '@/lib/utils'

type PageState = 'loading'|'found'|'new'|'reviewing'|'done'|'already'

const CATS = [
  { key:'teaching',        label:'Teaching Quality', icon:'👩‍🏫', desc:'How well teachers explain concepts' },
  { key:'concept_clarity', label:'Concept Clarity',  icon:'💡', desc:'Depth and clarity of teaching' },
  { key:'doubt_solving',   label:'Doubt Solving',    icon:'🙋', desc:'How doubts are handled' },
  { key:'homework',        label:'Homework Load',    icon:'📚', desc:'1 = Overwhelming, 5 = Balanced' },
  { key:'pressure',        label:'Academic Pressure',icon:'🎯', desc:'1 = Extreme, 5 = Healthy' },
]
const WORDS: Record<number,string> = {1:'Poor',2:'Below avg',3:'Average',4:'Good',5:'Excellent'}

export default function ReviewSchoolPage() {
  const router   = useRouter()
  const { user, profile } = useAuth()
  const { getSchoolDetails, setResolvedSchoolId } = useOnboarding()

  const [pageState,  setPageState]  = useState<PageState>('loading')
  const [school,     setSchool]     = useState<School|null>(null)
  const [creating,   setCreating]   = useState(false)
  const [ratings,    setRatings]    = useState<Ratings>({ teaching:0, concept_clarity:0, doubt_solving:0, homework:0, pressure:0 })
  const [writtenReview, setWritten] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitErr,  setSubmitErr]  = useState('')

  useEffect(() => {
    if (!user) { router.replace('/auth?returnTo=/onboarding/review-school&mode=signup'); return }
    const details = getSchoolDetails()
    if (!details?.name) { router.replace('/onboarding'); return }

    findSchoolByDetails(details.name, details.city, details.state).then(async found => {
      if (found) {
        setSchool(found)
        setResolvedSchoolId(found.school_id)
        const already = await hasUserReviewedSchool(user.uid, found.school_id)
        setPageState(already ? 'already' : 'found')
      } else {
        setPageState('new')
      }
    })
  }, [user]) // eslint-disable-line

  const details = getSchoolDetails()
  const allRated = Object.values(ratings).every(v => v > 0)
  const overall  = allRated ? (Object.values(ratings).reduce((a,b)=>a+b,0)/5).toFixed(1) : null

  const handleCreate = async () => {
    if (!user || !details) return
    setCreating(true)
    try {
      const s = await addSchool({ name:details.name, address:details.address, city:details.city, state:details.state, pincode:details.pincode, board:details.board, created_by:user.uid, photoFiles:details.photoFiles })
      setSchool(s); setResolvedSchoolId(s.school_id); setPageState('reviewing')
    } catch {
      // race: school was just created by someone else
      const found = await findSchoolByDetails(details.name, details.city, details.state)
      if (found) { setSchool(found); setResolvedSchoolId(found.school_id); setPageState('found') }
    } finally { setCreating(false) }
  }

  const handleSubmit = async () => {
    if (!user || !profile || !school || !allRated) return
    setSubmitting(true); setSubmitErr('')
    try {
      await addReview({ user_id:user.uid, username:profile.username, school_id:school.school_id, ratings, written_review:writtenReview, trust_score:profile.trust_score })
      setPageState('done')
    } catch (err: unknown) {
      setSubmitErr(err instanceof Error ? err.message : 'Failed to submit')
    } finally { setSubmitting(false) }
  }

  /* ── LOADING ─────────────────────────────────────────────────────────── */
  if (pageState === 'loading') return (
    <StepShell step={4} title="Finding your school…" subtitle="Searching our database…">
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
        {details && <div className="text-center"><p className="text-white font-semibold">{details.name}</p><p className="text-white/50 text-sm">{details.city}, {details.state}</p></div>}
      </div>
    </StepShell>
  )

  /* ── DONE ────────────────────────────────────────────────────────────── */
  if (pageState === 'done') return (
    <StepShell step={4} title="Review submitted!" subtitle="Your honest review helps thousands make better decisions.">
      <div className="flex flex-col items-center gap-5 py-4">
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </motion.div>
        {overall && <div className="text-center"><p className="text-white/60 text-sm mb-1">Your overall score</p><p className="text-5xl font-bold text-white">{overall}<span className="text-amber-400 text-2xl">★</span></p></div>}
        <div className="w-full space-y-2">
          {school && (
            <button onClick={() => router.push(`/school/${school.school_id}`)}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-white text-slate-900 hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg">
              <ExternalLink className="w-4 h-4" />View School Profile
            </button>
          )}
          <button onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-2xl font-semibold text-sm bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-all">
            Go to Dashboard
          </button>
        </div>
      </div>
    </StepShell>
  )

  /* ── ALREADY REVIEWED ────────────────────────────────────────────────── */
  if (pageState === 'already') return (
    <StepShell step={4} emoji="⭐" title="Already reviewed" subtitle="You've already submitted a review for this school — one per school keeps things honest.">
      <div className="space-y-3">
        {school && (
          <div className="bg-white/8 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0"><Building2 className="w-5 h-5 text-brand-400" /></div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-white text-sm truncate">{school.name}</p><p className="text-white/50 text-xs">{school.city}, {school.state}</p></div>
            {school.avg_overall > 0 && <span className="text-amber-400 font-bold text-lg ml-auto">{school.avg_overall.toFixed(1)}★</span>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {school && <button onClick={() => router.push(`/school/${school.school_id}`)} className="py-3 rounded-2xl text-sm font-semibold bg-brand-500/20 border border-brand-400/30 text-brand-300 hover:bg-brand-500/30 transition-all flex items-center justify-center gap-1.5"><ExternalLink className="w-4 h-4" />View Profile</button>}
          <button onClick={() => router.push('/dashboard')} className="py-3 rounded-2xl text-sm font-semibold bg-white/8 border border-white/10 text-white/70 hover:bg-white/12 transition-all">Dashboard</button>
        </div>
      </div>
    </StepShell>
  )

  /* ── FOUND EXISTING ─────────────────────────────────────────────────── */
  if (pageState === 'found' && school) return (
    <StepShell step={4} title="We found your school!" subtitle="This school is already in Edulytics. Review it now or just browse its profile.">
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="bg-white/8 border border-white/15 rounded-2xl p-5 mb-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/20 border border-brand-400/30 flex items-center justify-center flex-shrink-0"><Building2 className="w-5 h-5 text-brand-300" /></div>
            <div>
              <p className="font-bold text-white">{school.name}</p>
              <div className="flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-white/40" /><p className="text-white/50 text-xs">{school.city}, {school.state}</p></div>
              {school.address && <p className="text-white/35 text-xs mt-0.5 truncate">{school.address}</p>}
            </div>
          </div>
          {school.avg_overall > 0 && <div className="text-right ml-3 flex-shrink-0"><p className="text-2xl font-bold text-amber-400">{school.avg_overall.toFixed(1)}</p><p className="text-white/40 text-xs">avg</p></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-white/60 text-xs"><BookOpen className="w-3 h-3" />{school.board}</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-white/60 text-xs"><Users className="w-3 h-3" />{school.review_count} reviews</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs">✓ In Edulytics</span>
        </div>
      </motion.div>
      <div className="space-y-2">
        <button onClick={() => setPageState('reviewing')} className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 transition-all flex items-center justify-center gap-2"><PenLine className="w-4 h-4" />Write a Review Now</button>
        <button onClick={() => router.push(`/school/${school.school_id}`)} className="w-full py-3 rounded-2xl font-semibold text-sm bg-white/8 border border-white/15 text-white/80 hover:bg-white/12 transition-all flex items-center justify-center gap-2"><ExternalLink className="w-4 h-4" />Just view the school profile</button>
        <button onClick={() => router.push('/dashboard')} className="w-full py-2 text-xs text-white/35 hover:text-white/55 transition-colors">Skip to dashboard</button>
      </div>
    </StepShell>
  )

  /* ── NEW SCHOOL ─────────────────────────────────────────────────────── */
  if (pageState === 'new') return (
    <StepShell step={4} title="School not listed yet" subtitle="Add it and become the first to review it!">
      <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-5 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">🏫</span>
          <div><p className="font-bold text-white text-sm">{details?.name}</p><p className="text-white/50 text-xs mt-0.5">{details?.address && `${details.address}, `}{details?.city}, {details?.state} · {details?.board}</p><p className="text-amber-300 text-xs mt-2 font-medium">Not yet listed on Edulytics</p></div>
        </div>
      </div>
      <div className="space-y-2">
        <button onClick={handleCreate} disabled={creating}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
          {creating ? <><Loader2 className="w-4 h-4 animate-spin" />Adding school…</> : 'Add School & Write First Review →'}
        </button>
        <button onClick={() => router.push('/dashboard')} className="w-full py-2 text-xs text-white/35 hover:text-white/55 transition-colors">Skip to dashboard</button>
      </div>
    </StepShell>
  )

  /* ── REVIEW FORM ────────────────────────────────────────────────────── */
  if (pageState === 'reviewing' && school) return (
    <StepShell step={4} title="Rate your school" subtitle="Anonymous. Honest. Helps thousands." onBack={() => setPageState('found')}>
      <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
        {/* School chip */}
        <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5">
          <Building2 className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <span className="text-white font-medium text-sm truncate">{school.name}</span>
          <span className="text-white/40 text-xs ml-auto flex-shrink-0">{school.city}</span>
        </div>

        {/* Live preview */}
        <AnimatePresence>
          {overall && (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="flex items-center justify-center gap-2 bg-brand-500/15 border border-brand-400/30 rounded-2xl py-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">Overall: <span className="text-amber-400 text-lg font-bold">{overall}</span>/5</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        {CATS.map(({ key, label, icon, desc }) => {
          const val = ratings[key as keyof Ratings]
          return (
            <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div><p className="text-white font-medium text-sm flex items-center gap-1.5"><span>{icon}</span>{label}</p><p className="text-white/40 text-xs mt-0.5">{desc}</p></div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                  <RatingStars value={val} onChange={v => setRatings(r => ({ ...r, [key]: v }))} size="lg" />
                  <AnimatePresence mode="wait">
                    {val > 0 && <motion.span key={val} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      className={cn('text-xs font-semibold', val>=4?'text-emerald-400':val>=3?'text-amber-400':'text-red-400')}>{WORDS[val]}</motion.span>}
                  </AnimatePresence>
                </div>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                <motion.div animate={{ width: val ? `${(val/5)*100}%` : '0%' }} transition={{ duration:0.3 }}
                  className={cn('h-full rounded-full', val>=4?'bg-emerald-400':val>=3?'bg-amber-400':val>0?'bg-red-400':'')} />
              </div>
            </div>
          )
        })}

        {/* Written review */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Written Review <span className="text-white/35 font-normal">(optional — boosts trust score)</span></label>
          <textarea value={writtenReview} onChange={e => setWritten(e.target.value)} rows={4} maxLength={1000}
            placeholder="Share your honest experience about teaching quality, academic pressure, doubt solving, or anything a future student should know…"
            className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400/50 transition-all resize-none" />
          <div className="flex justify-between mt-1">
            {writtenReview.length>100 ? <span className="text-emerald-400 text-xs">✓ Detailed — boosts trust score</span> : <span className="text-white/30 text-xs">100+ chars earns trust boost</span>}
            <span className="text-white/30 text-xs">{writtenReview.length}/1000</span>
          </div>
        </div>

        {submitErr && <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 px-4 py-3 rounded-xl">{submitErr}</p>}

        <button onClick={handleSubmit} disabled={!allRated||submitting}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : <><Send className="w-4 h-4" />Submit Anonymous Review</>}
        </button>
        {!allRated && <p className="text-center text-white/35 text-xs">Rate all 5 categories to submit</p>}
      </div>
    </StepShell>
  )

  return null
}
