export const dynamic = 'force-dynamic'

'use client'

import { Suspense } from 'react'
import AuthPage from './AuthPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  )
}


