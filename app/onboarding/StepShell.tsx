'use client'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepShellProps {
  step: number          // 1-based current step
  totalSteps: number
  title: string
  subtitle?: string
  emoji?: string
  onBack?: () => void
  children: React.ReactNode
}

const STEP_LABELS = ['Language', 'Role', 'Your Info', 'Review School']

export default function StepShell({
  step, totalSteps, title, subtitle, emoji, onBack, children,
}: StepShellProps) {
  const pct = ((step - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full max-w-lg">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}
          <span className="text-white/40 text-xs font-medium">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-400"
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between mt-2">
          {STEP_LABELS.slice(0, totalSteps).map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                i + 1 < step ? 'bg-emerald-400' :
                i + 1 === step ? 'bg-brand-400 scale-125' :
                'bg-white/20'
              )} />
              <span className={cn(
                'text-[10px] font-medium transition-colors hidden sm:block',
                i + 1 <= step ? 'text-white/60' : 'text-white/25'
              )}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl"
      >
        {emoji && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280 }}
            className="text-5xl mb-4 block"
          >
            {emoji}
          </motion.div>
        )}
        <h2 className="font-display text-2xl font-bold text-white mb-1 leading-snug">{title}</h2>
        {subtitle && <p className="text-white/50 text-sm mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  )
}
