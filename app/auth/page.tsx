import dynamic from 'next/dynamic'

const AuthPage = dynamic(() => import('./AuthPage'), {
  ssr: false,
})

export default function Page() {
  return <AuthPage />
}
