import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  className?: string
  children: ReactNode
}

export function Field({ label, required, hint, className, children }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-white/80">
        {label}{required && <span className="text-brand-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-white/35">{hint}</p>}
    </div>
  )
}

const base =
  'w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400/50 transition-all'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(base, className)} {...props} />
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn(base, 'appearance-none cursor-pointer', className)} {...props}>
      {children}
    </select>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(base, 'resize-none', className)} {...props} />
}

interface ChoiceButtonProps {
  selected: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}
export function ChoiceButton({ selected, onClick, children, className }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
        selected
          ? 'bg-brand-500/30 border-brand-400 text-brand-300'
          : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30 hover:text-white/80',
        className
      )}
    >
      {children}
    </button>
  )
}

interface NextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children?: ReactNode
}
export function NextButton({ loading, children = 'Continue →', className, ...props }: NextButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      className={cn(
        'w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
        'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg hover:shadow-brand-500/30 hover:from-brand-400 hover:to-brand-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading
        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Processing...</>
        : children
      }
    </button>
  )
}
