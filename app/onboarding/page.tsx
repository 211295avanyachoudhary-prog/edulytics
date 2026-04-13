'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useOnboarding, UserRole } from '@/hooks/useOnboarding'
import StepShell from './StepShell'
import { NextButton } from './FormParts'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const roles: { id: UserRole; emoji: string; title: string; desc: string; color: string }[] = [
  {
    id: 'student',
    emoji: '🎒',
    title: 'Student',
    desc: 'I am currently studying at a school',
    color: 'from-brand-500/20 to-brand-600/10 border-brand-400/40',
  },
  {
    id: 'parent',
    emoji: '👨‍👩‍👧',
    title: 'Parent / Guardian',
    desc: 'My child attends or attended a school',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-400/40',
  },
  {
    id: 'teacher',
    emoji: '👩‍🏫',
    title: 'Teacher / Staff',
    desc: 'I teach or work at a school',
    color: 'from-violet-500/20 to-violet-600/10 border-violet-400/40',
  },
]

export default function OnboardingRolePage() {
  const router = useRouter()
  const { state, setRole } = useOnboarding()
  const [selected, setSelected] = useState<UserRole | null>(state.role)

  const handleContinue = () => {
    if (!selected) return
    setRole(selected)
    router.push(`/onboarding/${selected}`)
  }

  return (
    <StepShell
      step={2}
      totalSteps={4}
      emoji="👋"
      title="Who are you?"
      subtitle="This helps us ask the right questions about your school experience."
      onBack={() => router.push('/language')}
    >
      <div className="space-y-3 mb-6">
        {roles.map(({ id, emoji, title, desc, color }, i) => (
          <motion.button
            key={id}
            type="button"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i }}
            onClick={() => setSelected(id)}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              'w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200',
              selected === id
                ? `bg-gradient-to-r ${color} shadow-lg`
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
            )}
          >
            <span className="text-4xl flex-shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base">{title}</p>
              <p className="text-white/50 text-sm mt-0.5">{desc}</p>
            </div>
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all',
              selected === id ? 'border-brand-400 bg-brand-400' : 'border-white/25'
            )}>
              {selected === id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <NextButton disabled={!selected} onClick={handleContinue}>
        Continue as {selected ? roles.find(r => r.id === selected)?.title : '...'} →
      </NextButton>
    </StepShell>
  )
}
