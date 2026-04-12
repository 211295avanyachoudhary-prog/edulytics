import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export interface School {
  school_id: string
  name: string
  city: string
  state: string
  board: string
  created_by: string
  confidence_level: 'low' | 'medium' | 'high'
  created_at: unknown
  review_count: number
  avg_overall: number
  avg_teaching: number
  avg_concept_clarity: number
  avg_doubt_solving: number
  avg_homework: number
  avg_pressure: number
}

export interface AddSchoolInput {
  name: string
  city: string
  state: string
  board: string
  created_by: string
}

const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other']

export const addSchool = async (input: AddSchoolInput): Promise<School> => {
  const { name, city, state, board, created_by } = input

  if (!name || name.trim().length < 3) throw new Error('School name must be at least 3 characters')
  if (!city || !state || !board) throw new Error('All fields are required')

  // Check for duplicates
  const q = query(
    collection(db, 'schools'),
    where('name', '==', name.trim()),
    where('city', '==', city.trim()),
    where('state', '==', state.trim())
  )
  const existing = await getDocs(q)
  if (!existing.empty) throw new Error('This school already exists in our database')

  const schoolData = {
    name: name.trim(),
    city: city.trim(),
    state: state.trim(),
    board,
    created_by,
    confidence_level: 'low' as const,
    created_at: serverTimestamp(),
    review_count: 0,
    avg_overall: 0,
    avg_teaching: 0,
    avg_concept_clarity: 0,
    avg_doubt_solving: 0,
    avg_homework: 0,
    avg_pressure: 0,
  }

  const ref = await addDoc(collection(db, 'schools'), schoolData)

  // Increment user's schools_added
  await updateDoc(doc(db, 'users', created_by), { schools_added: increment(1) })

  return { school_id: ref.id, ...schoolData }
}

export const getSchool = async (schoolId: string): Promise<School | null> => {
  const snap = await getDoc(doc(db, 'schools', schoolId))
  if (!snap.exists()) return null
  return { school_id: snap.id, ...snap.data() } as School
}

export const searchSchools = async (searchTerm: string, sortBy: 'rating' | 'popularity' | 'activity' = 'popularity'): Promise<School[]> => {
  let q

  if (searchTerm && searchTerm.trim().length > 0) {
    const term = searchTerm.trim().toLowerCase()
    // Firestore doesn't support full-text search natively; we use a range query on name
    q = query(
      collection(db, 'schools'),
      orderBy('name'),
      where('name', '>=', term),
      where('name', '<=', term + '\uf8ff'),
      limit(20)
    )
  } else {
    const orderField = sortBy === 'rating' ? 'avg_overall' : 'review_count'
    q = query(collection(db, 'schools'), orderBy(orderField, 'desc'), limit(20))
  }

  const snap = await getDocs(q)
  return snap.docs.map(d => ({ school_id: d.id, ...d.data() } as School))
}

export const getAllSchools = async (): Promise<School[]> => {
  const q = query(collection(db, 'schools'), orderBy('review_count', 'desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ school_id: d.id, ...d.data() } as School))
}

export const getConfidenceLabel = (level: string, count: number): string => {
  if (count === 0) return 'No reviews yet'
  if (count < 3) return 'Emerging'
  if (count < 10) return 'Growing'
  return 'Well established'
}

export { BOARDS }
