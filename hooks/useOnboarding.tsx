'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'student' | 'parent' | 'teacher'

export interface StudentInfo {
  name: string
  age: string
  gender: string
  grade: string
  schoolName: string
  schoolAddress: string
  city: string
  state: string
  board: string
}

export interface ParentInfo {
  parentName: string
  childName: string
  childAge: string
  childGender: string
  grade: string
  schoolName: string
  schoolAddress: string
  city: string
  state: string
  board: string
  happyWithSchool: string
  concerns: string
}

export interface TeacherInfo {
  name: string
  age: string
  gender: string
  subject: string
  schoolName: string
  schoolAddress: string
  city: string
  state: string
  board: string
  yearsExperience: string
}

export interface OnboardingState {
  role: UserRole | null
  studentInfo: StudentInfo
  parentInfo: ParentInfo
  teacherInfo: TeacherInfo
  resolvedSchoolId: string | null
}

interface OnboardingContextType {
  state: OnboardingState
  setRole: (role: UserRole) => void
  setStudentInfo: (info: Partial<StudentInfo>) => void
  setParentInfo: (info: Partial<ParentInfo>) => void
  setTeacherInfo: (info: Partial<TeacherInfo>) => void
  setResolvedSchoolId: (id: string | null) => void
  getSchoolDetails: () => { name: string; city: string; state: string; board: string } | null
}

const defaultStudent: StudentInfo = {
  name: '', age: '', gender: '', grade: '',
  schoolName: '', schoolAddress: '', city: '', state: '', board: '',
}
const defaultParent: ParentInfo = {
  parentName: '', childName: '', childAge: '', childGender: '', grade: '',
  schoolName: '', schoolAddress: '', city: '', state: '', board: '',
  happyWithSchool: '', concerns: '',
}
const defaultTeacher: TeacherInfo = {
  name: '', age: '', gender: '', subject: '',
  schoolName: '', schoolAddress: '', city: '', state: '', board: '',
  yearsExperience: '',
}

const OnboardingContext = createContext<OnboardingContextType>({} as OnboardingContextType)

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OnboardingState>({
    role: null,
    studentInfo: defaultStudent,
    parentInfo: defaultParent,
    teacherInfo: defaultTeacher,
    resolvedSchoolId: null,
  })

  const setRole = (role: UserRole) => setState(s => ({ ...s, role }))
  const setStudentInfo = (info: Partial<StudentInfo>) =>
    setState(s => ({ ...s, studentInfo: { ...s.studentInfo, ...info } }))
  const setParentInfo = (info: Partial<ParentInfo>) =>
    setState(s => ({ ...s, parentInfo: { ...s.parentInfo, ...info } }))
  const setTeacherInfo = (info: Partial<TeacherInfo>) =>
    setState(s => ({ ...s, teacherInfo: { ...s.teacherInfo, ...info } }))
  const setResolvedSchoolId = (id: string | null) =>
    setState(s => ({ ...s, resolvedSchoolId: id }))

  const getSchoolDetails = () => {
    const { role, studentInfo, parentInfo, teacherInfo } = state
    if (role === 'student') return { name: studentInfo.schoolName, city: studentInfo.city, state: studentInfo.state, board: studentInfo.board }
    if (role === 'parent') return { name: parentInfo.schoolName, city: parentInfo.city, state: parentInfo.state, board: parentInfo.board }
    if (role === 'teacher') return { name: teacherInfo.schoolName, city: teacherInfo.city, state: teacherInfo.state, board: teacherInfo.board }
    return null
  }

  return (
    <OnboardingContext.Provider value={{ state, setRole, setStudentInfo, setParentInfo, setTeacherInfo, setResolvedSchoolId, getSchoolDetails }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => useContext(OnboardingContext)
