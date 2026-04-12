import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

export interface UserProfile {
  user_id: string
  username: string
  email: string
  trust_score: number
  created_at: unknown
  activity_log: string[]
  review_count: number
  schools_added: number
}

export const signUp = async (username: string, email: string, password: string): Promise<UserProfile> => {
  // Validate inputs
  if (!username || username.length < 3) throw new Error('Username must be at least 3 characters')
  if (!email || !email.includes('@')) throw new Error('Invalid email address')
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')

  const usernameLower = username.toLowerCase().trim()

  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: username })

  const profile: UserProfile = {
    user_id: cred.user.uid,
    username: usernameLower,
    email: email.toLowerCase(),
    trust_score: 1,
    created_at: serverTimestamp(),
    activity_log: [],
    review_count: 0,
    schools_added: 0,
  }

  await setDoc(doc(db, 'users', cred.user.uid), profile)
  return profile
}

export const signIn = async (email: string, password: string): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export const logOut = async (): Promise<void> => {
  await signOut(auth)
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
