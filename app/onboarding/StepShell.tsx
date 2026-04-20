'use client'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const LABELS = ['Language','Role','Your Info','Review School']

interface Props { step:number; title:string; subtitle?:string; emoji?:string; onBack?:()=>void; children:React.ReactNode }

export default function StepShell({ step, title, subtitle, emoji, onBack, children }: Props) {
  const pct = ((step-1)/3)*100
  return (
    <div className="w-full max-w-lg">
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          {onBack ? (
            <button onClick={onBack} className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
          ) : <div />}
          <span className="text-white/40 text-xs font-medium">Step {step} of 4</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-emerald-400" />
        </div>
        <div className="flex justify-between mt-2">
          {LABELS.map((l,i) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <div className={cn('w-2 h-2 rounded-full transition-all', i+1<step?'bg-emerald-400':i+1===step?'bg-brand-400 scale-125':'bg-white/20')} />
              <span className={cn('text-[10px] font-medium hidden sm:block', i+1<=step?'text-white/60':'text-white/25')}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity:0, y:24, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}
        className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-7 shadow-2xl">
        {emoji && <div className="text-5xl mb-4">{emoji}</div>}
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {subtitle && <p className="text-white/50 text-sm mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  )
}
