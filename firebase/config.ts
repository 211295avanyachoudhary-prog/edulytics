import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Only initialise on the client (or when env vars are present).
// During Next.js static generation the env vars are undefined — guard against that.
function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return null
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
}

const app = getFirebaseApp()

export const auth:    Auth            = app ? getAuth(app)      : ({} as Auth)
export const db:      Firestore       = app ? getFirestore(app) : ({} as Firestore)
export const storage: FirebaseStorage = app ? getStorage(app)   : ({} as FirebaseStorage)
export default app

