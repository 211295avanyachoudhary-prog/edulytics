import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const base = 'w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400/50 transition-all'

export function Field({ label, required, hint, className, children }: { label:string; required?:boolean; hint?:string; className?:string; children:ReactNode }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-white/80">{label}{required&&<span className="text-brand-400 ml-1">*</span>}</label>
      {children}
      {hint && <p className="text-xs text-white/35">{hint}</p>}
    </div>
  )
}
export function Input({ className, ...p }: React.InputHTMLAttributes<HTMLInputElement>) { return <input className={cn(base, className)} {...p} /> }
export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>&{ children:ReactNode }) { return <select className={cn(base, 'appearance-none cursor-pointer', className)} {...p}>{children}</select> }
export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn(base, 'resize-none', className)} {...p} /> }

export function Chip({ selected, onClick, children }: { selected:boolean; onClick:()=>void; children:ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('px-3.5 py-2 rounded-xl border text-sm font-medium transition-all',
        selected ? 'bg-brand-500/30 border-brand-400 text-brand-300' : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30 hover:text-white/80')}>
      {children}
    </button>
  )
}

export function NextBtn({ loading, children='Continue →', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>&{ loading?:boolean; children?:ReactNode }) {
  return (
    <button type="button"
      className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:from-brand-400 hover:to-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      {...p}>
      {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</> : children}
    </button>
  )
}
