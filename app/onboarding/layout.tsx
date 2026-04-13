'use client'
import { OnboardingProvider } from '@/hooks/useOnboarding'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 relative overflow-hidden">
        {/* ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-start justify-center min-h-[calc(100vh-64px)] py-8 px-4">
          {children}
        </div>
      </div>
    </OnboardingProvider>
  )
}
