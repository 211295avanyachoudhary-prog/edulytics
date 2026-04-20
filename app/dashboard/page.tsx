'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PenLine, Search, BarChart3, Shield, BookOpen, Star, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getAllSchools, School } from '@/lib/schools'
import { getUserReviews, Review } from '@/lib/reviews'
import SchoolCard from '@/components/SchoolCard'
import AddSchoolModal from '@/components/AddSchoolModal'
import { SchoolCardSkeleton } from '@/components/Skeleton'

const cv = { hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } }
const ci = { hidden:{ opacity:0, y:20 }, visible:{ opacity:1, y:0, transition:{ duration:0.4 } } }

export default function DashboardPage() {
  const { user, profile, loading:authLoading } = useAuth()
  const router = useRouter()
  const [schools,  setSchools]  = useState<School[]>([])
  const [reviews,  setReviews]  = useState<Review[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => { if (!authLoading && !user) router.replace('/auth') }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    Promise.all([getAllSchools().then(setSchools), getUserReviews(user.uid).then(setReviews)]).finally(() => setLoading(false))
  }, [user])

  if (authLoading) return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return null

  const topSchools = schools.filter(s => s.avg_overall > 0).sort((a,b) => b.avg_overall - a.avg_overall).slice(0,3)
  const newSchools = schools.filter(s => s.review_count === 0).slice(0,3)

  const stats = [
    { icon:PenLine,  label:'Reviews',      value:profile?.review_count ?? 0,           color:'from-brand-500 to-brand-600',   text:'text-brand-600'   },
    { icon:Shield,   label:'Trust Score',  value:profile?.trust_score?.toFixed(2)??'1.00', color:'from-emerald-500 to-emerald-600', text:'text-emerald-600' },
    { icon:BookOpen, label:'Schools Added',value:profile?.schools_added ?? 0,           color:'from-violet-500 to-violet-600', text:'text-violet-600'  },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-8">

          {/* Welcome banner */}
          <motion.div variants={ci} className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-slate-800 rounded-3xl p-8 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-emerald-600/15 rounded-full blur-3xl translate-y-1/2" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-white/80 text-xs font-medium">Welcome back</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Hey, {profile?.username || 'Student'} 👋</h1>
                <p className="text-white/60 text-sm">Your honest review matters. Help shape the future of education.</p>
              </div>
              <Link href="/school/select">
                <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="flex items-center gap-2 px-5 py-3 bg-white text-slate-900 font-semibold rounded-2xl text-sm whitespace-nowrap shadow-lg">
                  <PenLine className="w-4 h-4" />Write a Review
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={ci} className="grid grid-cols-3 gap-4">
            {stats.map(({ icon:Icon, label, value, color, text }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-slate-50">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5 text-white" /></div>
                <div className={`text-2xl font-bold ${text} mb-0.5`}>{value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions — AddSchoolModal properly placed here */}
          <motion.div variants={ci}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/school/select">
                <motion.div whileHover={{ y:-3 }} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover cursor-pointer group transition-all">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3 group-hover:bg-brand-100 transition-colors"><Search className="w-5 h-5 text-brand-600" /></div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">Explore Schools</h3>
                  <p className="text-xs text-slate-500">Browse all listed schools</p>
                </motion.div>
              </Link>

              {/* Add School card — clean standalone placement */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3"><BookOpen className="w-5 h-5 text-emerald-600" /></div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">Add a School</h3>
                <p className="text-xs text-slate-500 mb-4">Can't find your school? Add it to Edulytics.</p>
                <div className="mt-auto">
                  <AddSchoolModal onSuccess={() => getAllSchools().then(setSchools)} />
                </div>
              </div>

              <Link href="/profile">
                <motion.div whileHover={{ y:-3 }} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover cursor-pointer group transition-all">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors"><BarChart3 className="w-5 h-5 text-violet-600" /></div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">My Activity</h3>
                  <p className="text-xs text-slate-500">View your reviews & profile</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Top Rated */}
          {topSchools.length > 0 && (
            <motion.div variants={ci}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Star className="w-5 h-5 text-amber-400 fill-amber-400" />Top Rated Schools</h2>
                <Link href="/school/select" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <SchoolCardSkeleton key={i} />)}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{topSchools.map((s,i) => <SchoolCard key={s.school_id} school={s} index={i} />)}</div>
              )}
            </motion.div>
          )}

          {/* New schools */}
          {newSchools.length > 0 && (
            <motion.div variants={ci}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-brand-500" />Newly Added Schools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{newSchools.map((s,i) => <SchoolCard key={s.school_id} school={s} index={i} />)}</div>
            </motion.div>
          )}

          {/* My recent reviews */}
          {reviews.length > 0 && (
            <motion.div variants={ci}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">My Recent Reviews</h2>
                <Link href="/profile" className="text-sm text-brand-600 font-medium flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.slice(0,2).map(r => {
                  const avg = Object.values(r.ratings).reduce((a,b)=>a+b,0)/5
                  return (
                    <button key={r.review_id} onClick={() => router.push(`/school/${r.school_id}`)} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-card hover:shadow-md transition-all text-left">
                      <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-slate-700">Your Review</span><span className="text-lg font-bold text-brand-600">{avg.toFixed(1)}★</span></div>
                      {r.written_review && <p className="text-sm text-slate-500 line-clamp-2">"{r.written_review}"</p>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  )
}
