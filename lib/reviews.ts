import {
  collection, doc, setDoc, getDocs, getDoc,
  query, where, orderBy, limit, serverTimestamp,
  increment, runTransaction,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export interface Ratings {
  teaching: number
  concept_clarity: number
  doubt_solving: number
  homework: number
  pressure: number
}

export interface Review {
  review_id: string
  user_id: string
  username: string
  school_id: string
  ratings: Ratings
  written_review: string
  timestamp: unknown
  trust_score: number
}

const ABUSE = ['spam','abuse','scam','fake']
const hasAbuse = (t: string) => ABUSE.some(w => t.toLowerCase().includes(w))

const validateRatings = (r: Ratings) => {
  for (const k of Object.keys(r) as (keyof Ratings)[]) {
    if (!r[k] || r[k] < 1 || r[k] > 5) throw new Error(`Invalid rating: ${k}`)
  }
}

export const addReview = async (input: {
  user_id: string; username: string; school_id: string;
  ratings: Ratings; written_review: string; trust_score: number
}): Promise<Review> => {
  const { user_id, username, school_id, ratings, written_review, trust_score } = input
  validateRatings(ratings)
  if (written_review && hasAbuse(written_review)) throw new Error('Review contains inappropriate content')

  const reviewId = `${user_id}_${school_id}`
  const existing = await getDoc(doc(db, 'reviews', reviewId))
  if (existing.exists()) throw new Error('You have already reviewed this school')

  const reviewData = {
    user_id, username, school_id, ratings,
    written_review: written_review?.trim() || '',
    timestamp: serverTimestamp(),
    trust_score,
  }

  await runTransaction(db, async (tx) => {
    const schoolRef = doc(db, 'schools', school_id)
    const schoolSnap = await tx.get(schoolRef)
    if (!schoolSnap.exists()) throw new Error('School not found')
    const school = schoolSnap.data()
    const prevWeight = school.weighted_sum || 0
    const newWeight = prevWeight + trust_score
    const newCount = (school.review_count || 0) + 1

    const wa = (field: keyof Ratings, prev: number) =>
      ((prev * prevWeight) + ratings[field] * trust_score) / newWeight

    const nT  = wa('teaching',        school.avg_teaching        || 0)
    const nC  = wa('concept_clarity', school.avg_concept_clarity || 0)
    const nD  = wa('doubt_solving',   school.avg_doubt_solving   || 0)
    const nH  = wa('homework',        school.avg_homework        || 0)
    const nP  = wa('pressure',        school.avg_pressure        || 0)
    const nO  = (nT + nC + nD + nH + nP) / 5
    const conf = newCount < 3 ? 'low' : newCount < 10 ? 'medium' : 'high'

    tx.set(doc(db, 'reviews', reviewId), reviewData)
    tx.update(schoolRef, {
      review_count: newCount, weighted_sum: newWeight,
      avg_teaching: nT, avg_concept_clarity: nC, avg_doubt_solving: nD,
      avg_homework: nH, avg_pressure: nP, avg_overall: nO,
      confidence_level: conf,
    })
    const trustDelta = (written_review?.trim().length || 0) > 100 ? 0.1 : (written_review?.trim().length || 0) > 30 ? 0.05 : 0
    tx.update(doc(db, 'users', user_id), {
      review_count: increment(1),
      trust_score: Math.min(5, trust_score + trustDelta),
    })
  })

  return { review_id: reviewId, ...reviewData }
}

export const getSchoolReviews = async (schoolId: string): Promise<Review[]> => {
  const q = query(collection(db, 'reviews'), where('school_id','==',schoolId), orderBy('timestamp','desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ review_id: d.id, ...d.data() } as Review))
}

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const q = query(collection(db, 'reviews'), where('user_id','==',userId), orderBy('timestamp','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ review_id: d.id, ...d.data() } as Review))
}

export const hasUserReviewedSchool = async (userId: string, schoolId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'reviews', `${userId}_${schoolId}`))
  return snap.exists()
}

export const getRatingLabel = (r: number) =>
  r >= 4.5 ? 'Outstanding' : r >= 4 ? 'Excellent' : r >= 3.5 ? 'Good' : r >= 3 ? 'Average' : r >= 2 ? 'Below Average' : r > 0 ? 'Poor' : 'Not rated'

export const getRatingColor = (r: number) =>
  r >= 4 ? 'text-emerald-600' : r >= 3 ? 'text-amber-500' : r > 0 ? 'text-red-500' : 'text-slate-400'
