import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Edulytics — See the Real Truth About Schools',
  description: 'Student-driven, trust-weighted school reviews for India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
