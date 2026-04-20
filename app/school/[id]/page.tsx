'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MapPin, BookOpen, Users, Star, Shield, ArrowLeft, PenLine,
  Info, ChevronRight, BarChart3, ImagePlus, X, Loader2
} from 'lucide-react'
import { getSchool, School, getConfidenceLabel, addPhotosToSchool } from '@/lib/schools'
import { getSchoolReviews, hasUserReviewedSchool, Review, getRatingLabel } from '@/lib/reviews'
import { useAuth } from '@/hooks/useAuth'
import ReviewCard from '@/components/ReviewCard'
import RatingStars from '@/components/RatingStars'
import { ReviewCardSkeleton } from '@/components/Skeleton'
import { cn, formatDate } from '@/lib/utils'
import { useRef } from 'react'

const CATS = [
  { key:'avg_teaching',        label:'Teaching Quality', icon:'👩‍🏫' },
  { key:'avg_concept_clarity', label:'Concept Clarity',  icon:'💡' },
  { key:'avg_doubt_solving',   label:'Doubt Solving',    icon:'🙋' },
  { key:'avg_homework',        label:'Homework Load',    icon:'📚' },
  { key:'avg_pressure',        label:'Academic Pressure',icon:'🎯' },
]

export default function SchoolProfilePage() {
  // ✅ useParams() correctly gives us the id param
  const params   = useParams()
  const schoolId = params.id as string
  const router   = useRouter()
  const { user } = useAuth()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [school,      setSchool]      = useState<School|null>(null)
  const [reviews,     setReviews]     = useState<Review[]>([])
  const [hasReviewed, setHasReviewed] = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [uploading,   setUploading]   = useState(false)
  const [photoTab,    setPhotoTab]    = useState(0)

  useEffect(() => {
    if (!schoolId) return
    const load = async () => {
      setLoading(true)
      const [s, r] = await Promise.all([getSchool(schoolId), getSchoolReviews(schoolId)])
      setSchool(s)
      setReviews(r)
      if (user && s) {
        const already = await hasUserReviewedSchool(user.uid, schoolId)
        setHasReviewed(already)
      }
      setLoading(false)
    }
    load()
  }, [schoolId, user])

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !school) return
    const files = Array.from(e.target.files||[]).slice(0,5)
    if (!files.length) return
    setUploading(true)
    try {
      const merged = await addPhotosToSchool(school.school_id, files)
      setSchool(s => s ? { ...s, photos: merged } : s)
    } finally { setUploading(false) }
  }

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="h-48 bg-gradient-to-br from-slate-900 to-brand-900 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">{[...Array(3)].map((_,i) => <ReviewCardSkeleton key={i} />)}</div>
    </div>
  )

  if (!school) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">School not found</h2>
        <button onClick={() => router.push('/school/select')} className="text-brand-600 hover:underline text-sm">Browse all schools</button>
      </div>
    </div>
  )

  const rating = school.avg_overall || 0
  const rColor = rating>=4?'text-emerald-400':rating>=3?'text-amber-400':rating>0?'text-red-400':'text-slate-400'
  const confColor = school.confidence_level==='high'?'bg-emerald-500':school.confidence_level==='medium'?'bg-amber-500':'bg-slate-400'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 pb-8 pt-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-700/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-800/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />Back
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-medium">{school.board}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-xs font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full ${confColor}`} />{getConfidenceLabel(school.review_count)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{school.name}</h1>
              <div className="flex items-center gap-1.5 text-white/60 mb-1"><MapPin className="w-4 h-4" /><span className="text-sm">{school.city}, {school.state}</span></div>
              {school.address && <p className="text-white/40 text-sm ml-5">{school.address}{school.pincode ? ` — ${school.pincode}` : ''}</p>}
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center min-w-[160px]">
              {rating > 0 ? (
                <>
                  <div className={cn('text-5xl font-bold mb-1', rColor)}>{rating.toFixed(1)}</div>
                  <RatingStars value={Math.round(rating)} size="md" readonly />
                  <p className="text-white/70 text-sm mt-1.5">{getRatingLabel(rating)}</p>
                  <p className="text-white/40 text-xs mt-0.5">{school.review_count} {school.review_count===1?'review':'reviews'}</p>
                </>
              ) : (
                <div><p className="text-white/60 text-sm font-medium mb-1">No reviews yet</p><p className="text-white/40 text-xs">Be the first!</p></div>
              )}
            </div>
          </div>

          {/* Photo gallery strip */}
          {school.photos && school.photos.length > 0 && (
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {school.photos.map((url, i) => (
                <div key={i} className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 cursor-pointer" onClick={() => setPhotoTab(i)}>
                  <img src={url} alt={`School photo ${i+1}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                </div>
              ))}
              {user && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUploadPhotos} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center flex-shrink-0 hover:border-white/60 transition-colors">
                    {uploading ? <Loader2 className="w-5 h-5 text-white/50 animate-spin" /> : <><ImagePlus className="w-5 h-5 text-white/50" /><span className="text-white/40 text-xs mt-1">Add</span></>}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Category breakdown */}
            {rating > 0 && (
              <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} className="bg-white rounded-3xl p-6 shadow-card border border-slate-50">
                <div className="flex items-center gap-2 mb-5"><BarChart3 className="w-5 h-5 text-brand-500" /><h2 className="font-semibold text-slate-900">Category Breakdown</h2></div>
                <div className="space-y-4">
                  {CATS.map(({ key, label, icon }) => {
                    const val = (school as unknown as Record<string,number>)[key] || 0
                    const bc = val>=4?'bg-emerald-400':val>=3?'bg-amber-400':'bg-red-400'
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-600 flex items-center gap-1.5"><span>{icon}</span>{label}</span>
                          <span className={cn('text-sm font-bold', val>=4?'text-emerald-600':val>=3?'text-amber-600':'text-red-600')}>{val.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width:0 }} animate={{ width:`${(val/5)*100}%` }} transition={{ duration:0.7, delay:0.2 }} className={`h-full rounded-full ${bc}`} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Trust badge */}
            <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0"><Shield className="w-4 h-4 text-brand-600" /></div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Trust-Weighted Score</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Scores calculated as Σ(rating × trust_score) / Σ(trust_score). High-trust reviewers carry more weight.</p>
                </div>
              </div>
            </div>

            {/* Review CTA */}
            {user ? (
              hasReviewed ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                  <Star className="w-6 h-6 text-emerald-600 fill-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-800">You've reviewed this school</p>
                  <p className="text-xs text-emerald-600 mt-1">Thank you for contributing!</p>
                </div>
              ) : (
                <motion.button whileHover={{ y:-2 }} onClick={() => router.push(`/review/${schoolId}`)}
                  className="w-full bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all text-left">
                  <div className="flex items-center justify-between text-white">
                    <div><h3 className="font-semibold text-sm mb-0.5">Review this school</h3><p className="text-white/70 text-xs">Share your honest experience</p></div>
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><PenLine className="w-4 h-4" /></div>
                  </div>
                </motion.button>
              )
            ) : (
              <motion.button whileHover={{ y:-2 }} onClick={() => router.push('/auth')}
                className="w-full bg-slate-900 rounded-2xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all text-left">
                <div className="flex items-center justify-between text-white">
                  <div><h3 className="font-semibold text-sm mb-0.5">Sign in to review</h3><p className="text-white/60 text-xs">Join the community</p></div>
                  <ChevronRight className="w-5 h-5 text-white/60" />
                </div>
              </motion.button>
            )}

            {/* Add photos CTA (when no photos yet) */}
            {(!school.photos || school.photos.length === 0) && user && (
              <div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUploadPhotos} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:border-brand-300 hover:bg-brand-50/30 transition-all">
                  {uploading ? <Loader2 className="w-5 h-5 text-slate-400 animate-spin" /> : <><ImagePlus className="w-5 h-5 text-slate-400" /><span className="text-sm text-slate-500">Add School Photos</span><span className="text-xs text-slate-400">Help others see the campus</span></>}
                </button>
              </div>
            )}

            {/* School info */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-card space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Info className="w-4 h-4 text-slate-400" />School Info</h3>
              {[
                { label:'Board',    value:school.board },
                { label:'City',     value:school.city },
                { label:'State',    value:school.state },
                ...(school.address ? [{ label:'Address', value:school.address }] : []),
                ...(school.pincode ? [{ label:'Pincode', value:school.pincode }] : []),
                { label:'Reviews',  value:school.review_count.toString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-2 border-t border-slate-50 gap-3">
                  <span className="text-sm text-slate-500 flex-shrink-0">{label}</span>
                  <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                Student Reviews {reviews.length > 0 && <span className="text-sm font-normal text-slate-500">({reviews.length})</span>}
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><PenLine className="w-7 h-7 text-slate-400" /></div>
                <h3 className="font-semibold text-slate-700 mb-2">No reviews yet</h3>
                <p className="text-slate-500 text-sm mb-5">Be the first student to share the truth about this school.</p>
                {user && !hasReviewed && (
                  <button onClick={() => router.push(`/review/${schoolId}`)} className="px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm hover:bg-brand-700 transition-colors">
                    Write First Review
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r,i) => <ReviewCard key={r.review_id} review={r} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
