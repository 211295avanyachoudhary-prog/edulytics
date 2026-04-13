'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useOnboarding } from '@/hooks/useOnboarding'
import { BOARDS } from '@/lib/schools'
import { INDIAN_STATES } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, NextButton, ChoiceButton } from '../FormParts'

const GRADES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)]
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

export default function StudentInfoPage() {
  const router = useRouter()
  const { state, setStudentInfo } = useOnboarding()
  const [form, setForm] = useState(state.studentInfo)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.age || +form.age < 4 || +form.age > 22) e.age = 'Enter a valid age (4–22)'
    if (!form.gender) e.gender = 'Please select a gender'
    if (!form.grade) e.grade = 'Please select your grade'
    if (!form.schoolName.trim()) e.schoolName = 'School name is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'State is required'
    if (!form.board) e.board = 'Board is required'
    return e
  }

  const handleContinue = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setStudentInfo(form)
    router.push('/onboarding/review-school')
  }

  return (
    <StepShell
      step={3}
      totalSteps={4}
      emoji="🎒"
      title="Tell us about yourself"
      subtitle="We'll use this to find your school and personalise your review."
      onBack={() => router.push('/onboarding')}
    >
      <div className="space-y-4">
        {/* Personal */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" required className="col-span-2">
            <Input
              value={form.name}
              onChange={set('name')}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </Field>

          <Field label="Age" required>
            <Input
              type="number"
              value={form.age}
              onChange={set('age')}
              placeholder="e.g. 16"
              min={4} max={22}
            />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </Field>

          <Field label="Grade / Class" required>
            <Select value={form.grade} onChange={set('grade')}>
              <option value="">Select grade</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
            {errors.grade && <p className="text-xs text-red-400 mt-1">{errors.grade}</p>}
          </Field>
        </div>

        <Field label="Gender" required>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(g => (
              <ChoiceButton key={g} selected={form.gender === g} onClick={() => setForm(f => ({ ...f, gender: g }))}>
                {g}
              </ChoiceButton>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-red-400 mt-1">{errors.gender}</p>}
        </Field>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Your School</p>

          <Field label="School Name" required>
            <Input
              value={form.schoolName}
              onChange={set('schoolName')}
              placeholder="e.g. Delhi Public School"
            />
            {errors.schoolName && <p className="text-xs text-red-400 mt-1">{errors.schoolName}</p>}
          </Field>
        </div>

        <Field label="School Address" hint="Street address or landmark (optional)">
          <Input
            value={form.schoolAddress}
            onChange={set('schoolAddress')}
            placeholder="e.g. Sector 45, RK Puram"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City" required>
            <Input value={form.city} onChange={set('city')} placeholder="e.g. New Delhi" />
            {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
          </Field>

          <Field label="State" required>
            <Select value={form.state} onChange={set('state')}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
          </Field>
        </div>

        <Field label="Board" required>
          <div className="flex flex-wrap gap-2">
            {BOARDS.map(b => (
              <ChoiceButton key={b} selected={form.board === b} onClick={() => setForm(f => ({ ...f, board: b }))}>
                {b}
              </ChoiceButton>
            ))}
          </div>
          {errors.board && <p className="text-xs text-red-400 mt-1">{errors.board}</p>}
        </Field>

        <div className="pt-2">
          <NextButton onClick={handleContinue}>
            Find my school & continue →
          </NextButton>
        </div>
      </div>
    </StepShell>
  )
}
