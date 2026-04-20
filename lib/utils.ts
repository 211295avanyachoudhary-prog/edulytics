import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (ts: unknown): string => {
  if (!ts) return 'Recently'
  try {
    const date = (ts as { toDate: () => Date }).toDate()
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
  } catch { return 'Recently' }
}

export const truncate = (str: string, n: number) => str.length > n ? str.slice(0, n) + '...' : str

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh',
  'Lakshadweep','Puducherry',
]

export const BOARDS = ['CBSE','ICSE','State Board','IB','IGCSE','Other']
export const GRADES = ['Nursery','LKG','UKG',...Array.from({length:12},(_,i)=>`Grade ${i+1}`)]
export const SUBJECTS = [
  'Mathematics','Science','Physics','Chemistry','Biology',
  'English','Hindi','Social Studies','History','Geography',
  'Computer Science','Economics','Commerce','Arts','Physical Education','Other',
]
