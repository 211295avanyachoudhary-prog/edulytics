'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PenLine, BookOpen, Shield, Star, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getUserReviews, Review } from '@/lib/reviews'
import ReviewCard from '@/components/ReviewCard'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { user, profile, loading:authLoading } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (!authLoading && !user) router.replace('/auth') }, [user, authLoading, router])
  useEffect(() => { if (!user) return; getUserReviews(user.uid).then(setReviews).finally(() => setLoading(false)) }, [user])

  if (authLoading||loading) return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user||!profile) return null

  const trustLevel = profile.trust_score>=2.5?'Expert':profile.trust_score>=1.5?'Contributor':'Member'
  const trustGrad  = profile.trust_score>=2.5?'from-amber-500 to-orange-500':profile.trust_score>=1.5?'from-brand-500 to-violet-500':'from-slate-500 to-slate-600'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Profile card */}
        <div className="relative bg-gradient-to-br from-slate-900 to-brand-900 rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">{profile.username?.[0]?.toUpperCase()||'U'}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">@{profile.username}</h1>
                <span className={`px-2.5 py-0.5 rounded-full bg-gradient-to-r ${trustGrad} text-white text-xs font-semibold`}>{trustLevel}</span>
              </div>
              <p className="text-white/60 text-sm">{user.email}</p>
              <p className="text-white/40 text-xs mt-1">Joined {formatDate(profile.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon:PenLine,  label:'Reviews',       value:profile.review_count,               grad:'from-brand-500 to-brand-600',   text:'text-brand-600'   },
            { icon:Shield,   label:'Trust Score',   value:profile.trust_score?.toFixed(2),     grad:'from-emerald-500 to-emerald-600',text:'text-emerald-600' },
            { icon:BookOpen, label:'Schools Added', value:profile.schools_added??0,            grad:'from-violet-500 to-violet-600', text:'text-violet-600'  },
          ].map(({ icon:Icon, label, value, grad, text }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mx-auto mb-3`}><Icon className="w-5 h-5 text-white" /></div>
              <div className={`text-2xl font-bold ${text}`}>{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Trust progress */}
        <div className="bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 rounded-2xl p-5">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-brand-500" />Your Trust Score</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-3 bg-white rounded-full shadow-inner overflow-hidden">
              <motion.div initial={{ width:0 }} animate={{ width:`${(profile.trust_score/5)*100}%` }} transition={{ duration:0.8, delay:0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500" />
            </div>
            <span className="text-sm font-bold text-brand-700">{profile.trust_score?.toFixed(2)}/5.00</span>
          </div>
          <p className="text-xs text-slate-600">Write detailed, consistent reviews to increase your trust score. Higher trust means your ratings carry more weight.</p>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400 fill-amber-400" />My Reviews ({reviews.length})</h2>
          </div>
          {reviews.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <PenLine className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">No reviews yet</h3>
              <p className="text-slate-500 text-sm mb-5">Share your school experience to help others.</p>
              <Link href="/school/select"><button className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm hover:bg-brand-700 transition-colors">Find a School <ArrowRight className="w-4 h-4" /></button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r,i) => (
                <button key={r.review_id} onClick={() => {}} className="w-full text-left">
                  <ReviewCard review={r} index={i} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
