import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { School } from './schools'

export const findSchoolByDetails = async (
  name: string,
  city: string,
  state: string
): Promise<School | null> => {
  const nameTrimmed = name.trim()
  const cityTrimmed = city.trim()
  const stateTrimmed = state.trim()

  // 1. Exact match
  const exactQ = query(
    collection(db, 'schools'),
    where('name', '==', nameTrimmed),
    where('city', '==', cityTrimmed),
    where('state', '==', stateTrimmed)
  )
  const exactSnap = await getDocs(exactQ)
  if (!exactSnap.empty) {
    const d = exactSnap.docs[0]
    return { school_id: d.id, ...d.data() } as School
  }

  // 2. Prefix name search, filter by city+state client-side
  const nameLower = nameTrimmed.toLowerCase()
  const partialQ = query(
    collection(db, 'schools'),
    orderBy('name'),
    where('name', '>=', nameLower),
    where('name', '<=', nameLower + '\uf8ff'),
    limit(10)
  )
  const partialSnap = await getDocs(partialQ)
  if (!partialSnap.empty) {
    const match = partialSnap.docs.find(d => {
      const data = d.data()
      return (
        data.city?.toLowerCase() === cityTrimmed.toLowerCase() &&
        data.state?.toLowerCase() === stateTrimmed.toLowerCase()
      )
    })
    if (match) return { school_id: match.id, ...match.data() } as School
  }

  return null
}
