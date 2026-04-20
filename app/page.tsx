'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, TrendingUp, Users, CheckCircle2, XCircle, BarChart3, Lock, Zap, Globe } from 'lucide-react'

const stats    = [{ label:'Schools Listed', value:'500+', icon:Globe }, { label:'Student Reviews', value:'10K+', icon:Users }, { label:'Cities Covered', value:'120+', icon:TrendingUp }, { label:'Trust Verified', value:'98%', icon:Shield }]
const problems = ['Glossy brochures hide real teaching quality', 'Fake Google reviews from school staff', 'No way to know academic pressure levels', 'Parents decide based on marketing, not truth']
const solutions= ['Anonymous reviews from real students', 'Trust-weighted algorithm filters spam', '5-category detailed honest ratings', 'Confidence levels based on review volume']
const features = [
  { icon:Shield,   title:'Trust-Weighted Algorithm', desc:"Σ(rating × trust_score) / Σ(trust_score) — not just a simple average.", color:'from-brand-500 to-brand-600' },
  { icon:Lock,     title:'100% Anonymous',            desc:'No names, no photos. Only verified academic truth from real students.',  color:'from-emerald-500 to-emerald-600' },
  { icon:BarChart3,title:'5-Category Insights',       desc:'Teaching, Concept Clarity, Doubt Solving, Homework, Pressure rated separately.', color:'from-violet-500 to-violet-600' },
  { icon:Zap,      title:'Real-Time Confidence',      desc:'Every school earns a Confidence Level as more verified reviews come in.', color:'from-amber-500 to-amber-600' },
]

const item = { hidden:{ opacity:0, y:24 }, visible:{ opacity:1, y:0, transition:{ duration:0.45 } } }
const container = { hidden:{}, visible:{ transition:{ staggerChildren:0.1 } } }

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize:'50px 50px' }} />

        <div className="relative z-10 text-center page-container max-w-5xl py-20">
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white/90 text-sm font-medium">We don't show opinions. We show weighted truth.</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-display">
            See the{' '}
            <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">real truth</span>
            <br />about schools
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.25 }}
            className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Student-powered, algorithm-verified school reviews. Know teaching quality, academic pressure, and learning environment — before you decide.
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/language">
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.98 }}
                className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/school/select">
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.98 }}
                className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/15 transition-all text-base">
                Explore Schools
              </motion.button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.55 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-16 max-w-2xl mx-auto">
            {stats.map(({ label, value, icon:Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-white/60 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/60 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <motion.div animate={{ y:[0,12,0] }} transition={{ repeat:Infinity, duration:1.5 }} className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Problem/Solution */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-80px' }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm font-semibold">The Problem</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-6">School reputations are<span className="text-red-500"> built on lies</span></h2>
              <ul className="space-y-3">{problems.map((p,i) => <li key={i} className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" /><span className="text-slate-600">{p}</span></li>)}</ul>
            </motion.div>
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-700 text-sm font-semibold">The Edulytics Way</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-6">Truth that's<span className="bg-gradient-to-r from-emerald-600 to-brand-500 bg-clip-text text-transparent"> mathematically weighted</span></h2>
              <ul className="space-y-3">{solutions.map((s,i) => <li key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" /><span className="text-slate-700 font-medium">{s}</span></li>)}</ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="page-container">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How Edulytics works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">A rigorous system built to surface real academic truth — not just popular opinion.</p>
          </motion.div>
          <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once:true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon:Icon, title, desc, color }) => (
              <motion.div key={title} variants={item} whileHover={{ y:-6 }} className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md`}><Icon className="w-6 h-6 text-white" /></div>
                <h3 className="font-semibold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-950">
        <div className="page-container text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Final Score = Σ(rating × trust) / Σ(trust)</h2>
          <p className="text-white/60 text-lg mb-10">Mathematical truth, not popularity contests.</p>
          <Link href="/language">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl mx-auto hover:shadow-xl transition-all">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-slate-900">edu<span className="text-brand-600">lytics</span></span>
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Edulytics. Built for students, by students.</p>
          <div className="flex gap-4">
            <Link href="/auth" className="text-sm text-slate-500 hover:text-brand-600">Sign In</Link>
            <Link href="/language" className="text-sm text-brand-600 font-medium">Get Started →</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
