'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star, Shield, Users, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    icon: Star,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'from-amber-50 to-orange-50',
    title: 'Real Reviews from Real Students',
    desc: 'Every rating comes from a verified student experience. No marketing fluff, no biased parents — just honest academic truth from people who lived it.',
    highlight: '10,000+ verified student reviews',
  },
  {
    icon: Shield,
    color: 'from-brand-500 to-violet-600',
    bgColor: 'from-brand-50 to-violet-50',
    title: 'Trust-Weighted, Not Just Averaged',
    desc: 'Our algorithm weights each review by the reviewer\'s credibility. Detailed, consistent reviews carry more weight. Spam is automatically filtered out.',
    highlight: 'Mathematically verified scores',
  },
  {
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'from-emerald-50 to-teal-50',
    title: 'Help Others Make Better Choices',
    desc: 'Share your school experience anonymously. Your honest review could help thousands of families make the right educational decision.',
    highlight: 'Anonymous & safe to share',
  },
]

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const router = useRouter()

  const slide = slides[current]
  const Icon = slide.icon

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
    } else {
      router.push('/auth')
    }
  }

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent(c => c - 1)
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className={`min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br ${slide.bgColor} transition-all duration-700 p-4`}>
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === current ? 'w-8 bg-brand-600' : 'w-2 bg-slate-300'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl font-bold text-slate-900 mb-4 leading-snug"
            >
              {slide.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-slate-600 leading-relaxed mb-6"
            >
              {slide.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${slide.color} text-white text-sm font-semibold shadow-md`}
            >
              {slide.highlight}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={goPrev}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all',
              current > 0 ? 'text-slate-600 hover:bg-white hover:shadow-sm' : 'invisible'
            )}
          >
            <ChevronLeft className="w-4 h-4" />Back
          </button>

          <button
            onClick={() => router.push('/auth')}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip
          </button>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r ${slide.color} shadow-md hover:shadow-lg transition-all`}
          >
            {current === slides.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
