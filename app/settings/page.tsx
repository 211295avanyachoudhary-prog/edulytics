'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Globe, LogOut, Shield, Bell, ChevronRight, Moon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logOut } from '@/lib/auth'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { lang, setLanguage } = useLanguage()

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  const handleLogout = async () => {
    await logOut()
    router.push('/')
  }

  if (loading || !user) return null

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface-50">
      <div className="page-container py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-1">Settings</h1>
            <p className="text-slate-500">Manage your preferences</p>
          </div>

          {/* Language */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <h2 className="font-semibold text-slate-800 text-sm">Language</h2>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                { code: 'hi' as const, label: 'हिंदी', flag: '🇮🇳' },
              ].map(({ code, label, flag }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left',
                    lang === code
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="text-2xl">{flag}</span>
                  <span className={cn('font-medium text-sm', lang === code ? 'text-brand-700' : 'text-slate-700')}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <h2 className="font-semibold text-slate-800 text-sm">Account</h2>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { icon: Bell, label: 'Notifications', desc: 'Manage your alerts', onClick: () => {} },
                { icon: Moon, label: 'Dark Mode', desc: 'Coming soon', onClick: () => {} },
              ].map(({ icon: Icon, label, desc, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-800">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-card overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-5 hover:bg-red-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <LogOut className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Log Out</p>
                <p className="text-xs text-slate-400">Sign out of your account</p>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">Edulytics v1.0 · Built for students, by students</p>
        </motion.div>
      </div>
    </div>
  )
}
