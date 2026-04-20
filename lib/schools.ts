import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'

export interface School {
  school_id: string
  name: string
  address: string       // full street address
  city: string
  state: string
  pincode: string
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
  weighted_sum: number
  photos: string[]      // array of download URLs
}

export interface AddSchoolInput {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  board: string
  created_by: string
  photoFiles?: File[]
}

export const uploadSchoolPhotos = async (schoolId: string, files: File[]): Promise<string[]> => {
  const urls: string[] = []
  for (const file of files.slice(0, 5)) {  // max 5 photos
    const storageRef = ref(storage, `schools/${schoolId}/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    urls.push(url)
  }
  return urls
}

export const addSchool = async (input: AddSchoolInput): Promise<School> => {
  const { name, address, city, state, pincode, board, created_by, photoFiles } = input
  if (!name.trim() || name.trim().length < 3) throw new Error('School name must be at least 3 characters')
  if (!city.trim() || !state || !board) throw new Error('City, state and board are required')

  // Duplicate check
  const q = query(
    collection(db, 'schools'),
    where('name', '==', name.trim()),
    where('city', '==', city.trim()),
    where('state', '==', state.trim()),
  )
  const existing = await getDocs(q)
  if (!existing.empty) throw new Error('This school already exists in our database')

  const schoolData = {
    name: name.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
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
    weighted_sum: 0,
    photos: [] as string[],
  }

  const docRef = await addDoc(collection(db, 'schools'), schoolData)

  // Upload photos if provided
  if (photoFiles && photoFiles.length > 0) {
    const photoUrls = await uploadSchoolPhotos(docRef.id, photoFiles)
    await updateDoc(doc(db, 'schools', docRef.id), { photos: photoUrls })
    schoolData.photos = photoUrls
  }

  await updateDoc(doc(db, 'users', created_by), { schools_added: increment(1) })
  return { school_id: docRef.id, ...schoolData }
}

export const addPhotosToSchool = async (schoolId: string, files: File[]): Promise<string[]> => {
  const urls = await uploadSchoolPhotos(schoolId, files)
  const schoolRef = doc(db, 'schools', schoolId)
  const snap = await getDoc(schoolRef)
  const existing = snap.data()?.photos || []
  const merged = [...existing, ...urls].slice(0, 10)  // max 10 total
  await updateDoc(schoolRef, { photos: merged })
  return merged
}

export const getSchool = async (schoolId: string): Promise<School | null> => {
  const snap = await getDoc(doc(db, 'schools', schoolId))
  if (!snap.exists()) return null
  return { school_id: snap.id, ...snap.data() } as School
}

export const searchSchools = async (term: string): Promise<School[]> => {
  if (!term.trim()) return getAllSchools()
  const t = term.trim().toLowerCase()
  const q = query(
    collection(db, 'schools'),
    orderBy('name'),
    where('name', '>=', t),
    where('name', '<=', t + '\uf8ff'),
    limit(20),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ school_id: d.id, ...d.data() } as School))
}

export const getAllSchools = async (): Promise<School[]> => {
  const q = query(collection(db, 'schools'), orderBy('review_count', 'desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ school_id: d.id, ...d.data() } as School))
}

export const findSchoolByDetails = async (name: string, city: string, state: string): Promise<School | null> => {
  const exactQ = query(
    collection(db, 'schools'),
    where('name', '==', name.trim()),
    where('city', '==', city.trim()),
    where('state', '==', state.trim()),
  )
  const snap = await getDocs(exactQ)
  if (!snap.empty) return { school_id: snap.docs[0].id, ...snap.docs[0].data() } as School

  const prefixQ = query(
    collection(db, 'schools'),
    orderBy('name'),
    where('name', '>=', name.trim().toLowerCase()),
    where('name', '<=', name.trim().toLowerCase() + '\uf8ff'),
    limit(10),
  )
  const pSnap = await getDocs(prefixQ)
  const match = pSnap.docs.find(d => {
    const data = d.data()
    return data.city?.toLowerCase() === city.toLowerCase() && data.state?.toLowerCase() === state.toLowerCase()
  })
  if (match) return { school_id: match.id, ...match.data() } as School
  return null
}

export const getConfidenceLabel = (count: number): string => {
  if (count === 0) return 'No reviews'
  if (count < 3) return 'Emerging'
  if (count < 10) return 'Growing'
  return 'Well established'
}
