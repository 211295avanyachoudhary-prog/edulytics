'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react'
import { signUp, signIn } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const router       = useRouter()
  const params       = useSearchParams()
  const { user }     = useAuth()
  const [isSignup, setIsSignup] = useState(params.get('mode') === 'signup')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)
  const [form, setForm] = useState({ username:'', email:'', password:'' })

  const returnTo = params.get('returnTo') || '/dashboard'

  useEffect(() => { if (user) router.replace(returnTo) }, [user, router, returnTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      if (isSignup) {
        await signUp(form.username, form.email, form.password)
        setSuccess(true)
        setTimeout(() => router.push(returnTo), 1200)
      } else {
        await signIn(form.email, form.password)
        router.push(returnTo)
      }
    } catch (err: unknown) {
      const m = err instanceof Error ? err.message : 'Authentication failed'
      setError(m.replace('Firebase: ','').replace(/\(auth\/.*?\)/,'').trim())
    } finally { setLoading(false) }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]:e.target.value }))

  if (success) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} className="text-center">
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300, delay:0.1 }}
          className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome to Edulytics!</h2>
        <p className="text-slate-500 mt-2">Redirecting...</p>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50/30 p-4">
      <div className="w-full max-w-[440px]">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to home
        </Link>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white" /></div>
              <span className="font-bold text-lg text-slate-900">edu<span className="text-brand-600">lytics</span></span>
            </div>
            <div className="flex bg-slate-100 rounded-2xl p-1">
              {['Sign In','Sign Up'].map((t,i) => (
                <button key={t} onClick={() => { setIsSignup(i===1); setError('') }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${isSignup===(i===1)?'bg-white text-slate-900 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.form key={isSignup?'up':'in'} initial={{ opacity:0, x:isSignup?20:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
                onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                    <input type="text" required value={form.username} onChange={set('username')} placeholder="yourname123" minLength={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPwd?'text':'password'} required value={form.password} onChange={set('password')} placeholder="••••••••" minLength={6}
                      className="w-full px-4 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">{error}</motion.div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{isSignup?'Creating...':'Signing in...'}</> : isSignup?'Create Account':'Sign In'}
                </button>
              </motion.form>
            </AnimatePresence>
            <p className="text-center text-xs text-slate-400 mt-6">
              {isSignup?'Already have an account? ':"Don't have an account? "}
              <button onClick={() => { setIsSignup(!isSignup); setError('') }} className="text-brand-600 font-medium hover:text-brand-700">
                {isSignup?'Sign In':'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
