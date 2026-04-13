'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'en' as const, native: 'English', flag: '🇬🇧', desc: 'Continue in English' },
  { code: 'hi' as const, native: 'हिंदी', flag: '🇮🇳', desc: 'हिंदी में जारी रखें' },
]

const STEP_LABELS = ['Language', 'Role', 'Your Info', 'Review School']

export default function LanguagePage() {
  const router = useRouter()
  const { lang, setLanguage } = useLanguage()

  const handleSelect = (code: 'en' | 'hi') => {
    setLanguage(code)
    setTimeout(() => router.push('/onboarding'), 280)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">

        {/* Progress header — step 1 of 4 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/40 text-xs font-medium ml-auto">Step 1 of 4</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '0%' }}
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-400"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i === 0 ? 'bg-brand-400 scale-125' : 'bg-white/20'
                )} />
                <span className={cn(
                  'text-[10px] font-medium transition-colors hidden sm:block',
                  i === 0 ? 'text-white/60' : 'text-white/25'
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
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280 }}
            className="text-5xl mb-4 block"
          >
            🌐
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-white mb-1 leading-snug">Choose your language</h2>
          <p className="text-white/50 text-sm mb-6">You can change this anytime in Settings</p>

          <div className="space-y-3 mb-6">
            {languages.map(({ code, native, flag, desc }, i) => (
              <motion.button
                key={code}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                onClick={() => handleSelect(code)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200',
                  lang === code
                    ? 'border-brand-400 bg-brand-500/20 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                )}
              >
                <span className="text-4xl">{flag}</span>
                <div className="flex-1">
                  <span className="font-bold text-white text-lg block">{native}</span>
                  <span className="text-white/50 text-sm">{desc}</span>
                </div>
                {lang === code
                  ? <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  : <ArrowRight className="w-5 h-5 text-white/30 flex-shrink-0" />}
              </motion.button>
            ))}
          </div>

          {lang && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push('/onboarding')}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 transition-all flex items-center justify-center gap-2"
            >
              Continue →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
