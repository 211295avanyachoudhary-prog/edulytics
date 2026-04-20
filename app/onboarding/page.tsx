'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboarding, UserRole } from '@/hooks/useOnboarding'
import StepShell from './StepShell'
import { NextBtn } from './FormParts'
import { cn } from '@/lib/utils'

const ROLES: { id:UserRole; emoji:string; title:string; desc:string; sel:string }[] = [
  { id:'student', emoji:'🎒', title:'Student',          desc:'I am currently studying at a school',       sel:'from-brand-500/20 to-brand-600/10 border-brand-400/40' },
  { id:'parent',  emoji:'👨‍👩‍👧', title:'Parent / Guardian', desc:'My child attends or attended a school',      sel:'from-emerald-500/20 to-emerald-600/10 border-emerald-400/40' },
  { id:'teacher', emoji:'👩‍🏫', title:'Teacher / Staff',    desc:'I teach or work at a school',               sel:'from-violet-500/20 to-violet-600/10 border-violet-400/40' },
]

export default function RolePage() {
  const router = useRouter()
  const { state, setRole } = useOnboarding()
  const [sel, setSel] = useState<UserRole|null>(state.role)

  const next = () => { if (!sel) return; setRole(sel); router.push(`/onboarding/${sel}`) }

  return (
    <StepShell step={2} emoji="👋" title="Who are you?" subtitle="This helps us ask the right questions." onBack={() => router.push('/language')}>
      <div className="space-y-3 mb-6">
        {ROLES.map(({ id, emoji, title, desc, sel: selClass },i) => (
          <motion.button key={id} type="button" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.08*i }}
            onClick={() => setSel(id)} whileHover={{ scale:1.01, x:4 }} whileTap={{ scale:0.99 }}
            className={cn('w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all',
              sel===id ? `bg-gradient-to-r ${selClass} shadow-lg` : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8')}>
            <span className="text-4xl flex-shrink-0">{emoji}</span>
            <div className="flex-1"><p className="font-bold text-white">{title}</p><p className="text-white/50 text-sm mt-0.5">{desc}</p></div>
            <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center', sel===id?'border-brand-400 bg-brand-400':'border-white/25')}>
              {sel===id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </motion.button>
        ))}
      </div>
      <NextBtn disabled={!sel} onClick={next}>Continue as {sel ? ROLES.find(r=>r.id===sel)?.title : '...'} →</NextBtn>
    </StepShell>
  )
}
