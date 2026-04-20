'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'student' | 'parent' | 'teacher'

export interface StudentInfo {
  name: string; age: string; gender: string; grade: string
  schoolName: string; schoolAddress: string; schoolPincode: string
  city: string; state: string; board: string
  photoFiles: File[]
}
export interface ParentInfo {
  parentName: string; childName: string; childAge: string; childGender: string; grade: string
  schoolName: string; schoolAddress: string; schoolPincode: string
  city: string; state: string; board: string
  happyWithSchool: string; concerns: string
  photoFiles: File[]
}
export interface TeacherInfo {
  name: string; age: string; gender: string; subject: string; yearsExperience: string
  schoolName: string; schoolAddress: string; schoolPincode: string
  city: string; state: string; board: string
  photoFiles: File[]
}

export interface OnboardingState {
  role: UserRole | null
  studentInfo: StudentInfo
  parentInfo: ParentInfo
  teacherInfo: TeacherInfo
  resolvedSchoolId: string | null
}

interface OnboardingCtx {
  state: OnboardingState
  setRole: (r: UserRole) => void
  setStudentInfo: (i: Partial<StudentInfo>) => void
  setParentInfo: (i: Partial<ParentInfo>) => void
  setTeacherInfo: (i: Partial<TeacherInfo>) => void
  setResolvedSchoolId: (id: string | null) => void
  getSchoolDetails: () => { name: string; address: string; city: string; state: string; pincode: string; board: string; photoFiles: File[] } | null
}

const blank = { photoFiles: [] as File[] }

const defaultStudent: StudentInfo = { name:'', age:'', gender:'', grade:'', schoolName:'', schoolAddress:'', schoolPincode:'', city:'', state:'', board:'', ...blank }
const defaultParent: ParentInfo   = { parentName:'', childName:'', childAge:'', childGender:'', grade:'', schoolName:'', schoolAddress:'', schoolPincode:'', city:'', state:'', board:'', happyWithSchool:'', concerns:'', ...blank }
const defaultTeacher: TeacherInfo = { name:'', age:'', gender:'', subject:'', yearsExperience:'', schoolName:'', schoolAddress:'', schoolPincode:'', city:'', state:'', board:'', ...blank }

const Ctx = createContext<OnboardingCtx>({} as OnboardingCtx)

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>({
    role: null,
    studentInfo: defaultStudent,
    parentInfo: defaultParent,
    teacherInfo: defaultTeacher,
    resolvedSchoolId: null,
  })

  const setRole            = (r: UserRole)              => setState(s => ({ ...s, role: r }))
  const setStudentInfo     = (i: Partial<StudentInfo>)  => setState(s => ({ ...s, studentInfo: { ...s.studentInfo, ...i } }))
  const setParentInfo      = (i: Partial<ParentInfo>)   => setState(s => ({ ...s, parentInfo:  { ...s.parentInfo,  ...i } }))
  const setTeacherInfo     = (i: Partial<TeacherInfo>)  => setState(s => ({ ...s, teacherInfo: { ...s.teacherInfo, ...i } }))
  const setResolvedSchoolId = (id: string | null)       => setState(s => ({ ...s, resolvedSchoolId: id }))

  const getSchoolDetails = () => {
    const { role, studentInfo: s, parentInfo: p, teacherInfo: t } = state
    if (role === 'student') return { name: s.schoolName, address: s.schoolAddress, city: s.city, state: s.state, pincode: s.schoolPincode, board: s.board, photoFiles: s.photoFiles }
    if (role === 'parent')  return { name: p.schoolName, address: p.schoolAddress, city: p.city, state: p.state, pincode: p.schoolPincode, board: p.board, photoFiles: p.photoFiles }
    if (role === 'teacher') return { name: t.schoolName, address: t.schoolAddress, city: t.city, state: t.state, pincode: t.schoolPincode, board: t.board, photoFiles: t.photoFiles }
    return null
  }

  return <Ctx.Provider value={{ state, setRole, setStudentInfo, setParentInfo, setTeacherInfo, setResolvedSchoolId, getSchoolDetails }}>{children}</Ctx.Provider>
}

export const useOnboarding = () => useContext(Ctx)
