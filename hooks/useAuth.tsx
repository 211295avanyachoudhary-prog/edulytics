'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, getUserProfile, UserProfile } from '@/lib/auth'

interface AuthCtx { user: User|null; profile: UserProfile|null; loading: boolean; refreshProfile: ()=>Promise<void> }
const AuthContext = createContext<AuthCtx>({ user:null, profile:null, loading:true, refreshProfile:async()=>{} })

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<User|null>(null)
  const [profile, setProfile] = useState<UserProfile|null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => { if (user) setProfile(await getUserProfile(user.uid)) }

  useEffect(() => {
    return onAuthChange(async (u) => {
      setUser(u)
      setProfile(u ? await getUserProfile(u.uid) : null)
      setLoading(false)
    })
  }, [])

  return <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
