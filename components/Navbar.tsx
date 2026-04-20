'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Menu, X, Home, Search, User, Settings, LogOut, BarChart3 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { logOut } from '@/lib/auth'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',     label: 'Dashboard', icon: Home   },
  { href: '/school/select', label: 'Explore',   icon: Search },
  { href: '/profile',       label: 'Profile',   icon: User   },
]

export default function Navbar() {
  const { user, profile } = useAuth()
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => { await logOut(); router.push('/') }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            edu<span className="text-brand-600">lytics</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn('flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  pathname === href ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Trust: {profile?.trust_score?.toFixed(1) ?? '1.0'}</span>
                </div>
                <Link href="/settings"><button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"><Settings className="w-4 h-4" /></button></Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" /><span className="hidden lg:inline">Logout</span>
                </button>
              </div>
              <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth"><button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors">Sign In</button></Link>
              <Link href="/auth?mode=signup"><button className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-sm">Get Started</button></Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && user && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                  pathname === href ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>
                <Icon className="w-4 h-4" />{label}
              </Link>
            ))}
            <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"><Settings className="w-4 h-4" />Settings</Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" />Logout</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
