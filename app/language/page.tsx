'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  {
    code: 'en' as const,
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    desc: 'Discover school truths in English',
  },
  {
    code: 'hi' as const,
    name: 'Hindi',
    native: 'हिंदी',
    flag: '🇮🇳',
    desc: 'स्कूलों की सच्चाई हिंदी में खोजें',
  },
]

export default function LanguagePage() {
  const router = useRouter()
  const { lang, setLanguage } = useLanguage()

  const handleSelect = (code: 'en' | 'hi') => {
    setLanguage(code)
    setTimeout(() => router.push('/onboarding'), 300)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">
            Choose your language
          </h1>
          <p className="text-slate-500">Select how you'd like to use Edulytics</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {languages.map(({ code, name, native, flag, desc }, i) => (
            <motion.button
              key={code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(code)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all duration-200 shadow-card',
                lang === code
                  ? 'border-brand-500 bg-brand-50 shadow-glow'
                  : 'border-slate-200 bg-white hover:border-brand-300'
              )}
            >
              <span className="text-5xl">{flag}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg">{native}</span>
                  {name !== native && (
                    <span className="text-sm text-slate-500">({name})</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </div>
              {lang === code && (
                <CheckCircle2 className="w-6 h-6 text-brand-500 flex-shrink-0" />
              )}
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-400 mt-6"
        >
          You can change this anytime in Settings
        </motion.p>
      </div>
    </div>
  )
}
