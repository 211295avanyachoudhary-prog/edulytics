import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  runTransaction,
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

export interface AddReviewInput {
  user_id: string
  username: string
  school_id: string
  ratings: Ratings
  written_review: string
  trust_score: number
}

const ABUSE_WORDS = ['spam', 'fake', 'scam'] // extend as needed

const containsAbuse = (text: string): boolean => {
  const lower = text.toLowerCase()
  return ABUSE_WORDS.some(w => lower.includes(w))
}

const validateRatings = (ratings: Ratings): void => {
  const fields: (keyof Ratings)[] = ['teaching', 'concept_clarity', 'doubt_solving', 'homework', 'pressure']
  for (const f of fields) {
    if (!ratings[f] || ratings[f] < 1 || ratings[f] > 5) {
      throw new Error(`Invalid rating for ${f}`)
    }
  }
}

export const addReview = async (input: AddReviewInput): Promise<Review> => {
  const { user_id, username, school_id, ratings, written_review, trust_score } = input

  validateRatings(ratings)

  if (written_review && containsAbuse(written_review)) {
    throw new Error('Review contains inappropriate content')
  }

  // Check for existing review (one per user per school)
  const reviewId = `${user_id}_${school_id}`
  const existing = await getDoc(doc(db, 'reviews', reviewId))
  if (existing.exists()) throw new Error('You have already reviewed this school')

  const reviewData: Omit<Review, 'review_id'> = {
    user_id,
    username,
    school_id,
    ratings,
    written_review: written_review?.trim() || '',
    timestamp: serverTimestamp(),
    trust_score,
  }

  // Use transaction to update review + school stats atomically
  await runTransaction(db, async (tx) => {
    const schoolRef = doc(db, 'schools', school_id)
    const schoolSnap = await tx.get(schoolRef)
    if (!schoolSnap.exists()) throw new Error('School not found')

    const school = schoolSnap.data()
    const prevCount = school.review_count || 0

    // Fetch all existing reviews to recalculate weighted avg
    // For performance, we'll do incremental update
    const newCount = prevCount + 1

    // Simple incremental weighted average
    const prevWeight = school.weighted_sum || prevCount
    const newWeight = prevWeight + trust_score

    const calcAvg = (field: keyof Ratings, prevAvg: number) => {
      const prevTotal = prevAvg * prevWeight
      return (prevTotal + ratings[field] * trust_score) / newWeight
    }

    const newTeaching = calcAvg('teaching', school.avg_teaching || 0)
    const newClarity = calcAvg('concept_clarity', school.avg_concept_clarity || 0)
    const newDoubt = calcAvg('doubt_solving', school.avg_doubt_solving || 0)
    const newHomework = calcAvg('homework', school.avg_homework || 0)
    const newPressure = calcAvg('pressure', school.avg_pressure || 0)
    const newOverall = (newTeaching + newClarity + newDoubt + newHomework + newPressure) / 5

    const confidence = newCount < 3 ? 'low' : newCount < 10 ? 'medium' : 'high'

    tx.set(doc(db, 'reviews', reviewId), reviewData)
    tx.update(schoolRef, {
      review_count: newCount,
      weighted_sum: newWeight,
      avg_teaching: newTeaching,
      avg_concept_clarity: newClarity,
      avg_doubt_solving: newDoubt,
      avg_homework: newHomework,
      avg_pressure: newPressure,
      avg_overall: newOverall,
      confidence_level: confidence,
    })

    // Update user stats & trust score
    const userRef = doc(db, 'users', user_id)
    const reviewLength = written_review?.trim().length || 0
    const trustDelta = reviewLength > 100 ? 0.1 : reviewLength > 30 ? 0.05 : 0
    tx.update(userRef, {
      review_count: increment(1),
      trust_score: Math.min(5, trust_score + trustDelta),
    })
  })

  return { review_id: reviewId, ...reviewData }
}

export const getSchoolReviews = async (schoolId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('school_id', '==', schoolId),
    orderBy('timestamp', 'desc'),
    limit(50)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ review_id: d.id, ...d.data() } as Review))
}

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('user_id', '==', userId),
    orderBy('timestamp', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ review_id: d.id, ...d.data() } as Review))
}

export const hasUserReviewedSchool = async (userId: string, schoolId: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, 'reviews', `${userId}_${schoolId}`))
  return snap.exists()
}

export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Outstanding'
  if (rating >= 4) return 'Excellent'
  if (rating >= 3.5) return 'Good'
  if (rating >= 3) return 'Average'
  if (rating >= 2) return 'Below Average'
  return 'Poor'
}

export const getRatingColor = (rating: number): string => {
  if (rating >= 4) return 'text-emerald-600'
  if (rating >= 3) return 'text-amber-500'
  return 'text-red-500'
}
