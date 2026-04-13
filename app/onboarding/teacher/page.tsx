'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useOnboarding } from '@/hooks/useOnboarding'
import { BOARDS } from '@/lib/schools'
import { INDIAN_STATES } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, NextButton, ChoiceButton } from '../FormParts'

const SUBJECTS = [
  'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Studies', 'History', 'Geography',
  'Computer Science', 'Economics', 'Commerce', 'Arts', 'Physical Education', 'Other',
]
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const EXPERIENCE = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10–20 years', '20+ years']

export default function TeacherInfoPage() {
  const router = useRouter()
  const { state, setTeacherInfo } = useOnboarding()
  const [form, setForm] = useState(state.teacherInfo)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.age || +form.age < 18 || +form.age > 75) e.age = 'Enter a valid age (18–75)'
    if (!form.gender) e.gender = 'Please select a gender'
    if (!form.subject) e.subject = 'Please select your subject'
    if (!form.schoolName.trim()) e.schoolName = 'School name is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'State is required'
    if (!form.board) e.board = 'Board is required'
    if (!form.yearsExperience) e.yearsExperience = 'Please select experience'
    return e
  }

  const handleContinue = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setTeacherInfo(form)
    router.push('/onboarding/review-school')
  }

  return (
    <StepShell
      step={3}
      totalSteps={4}
      emoji="👩‍🏫"
      title="Tell us about yourself"
      subtitle="Educator perspectives reveal what parents and students never see — help them understand the real environment."
      onBack={() => router.push('/onboarding')}
    >
      <div className="space-y-4">
        {/* Personal */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" required className="col-span-2">
            <Input value={form.name} onChange={set('name')} placeholder="Your full name" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </Field>

          <Field label="Age" required>
            <Input type="number" value={form.age} onChange={set('age')} placeholder="e.g. 34" min={18} max={75} />
            {errors.age && <p className="text-xs text-red-400 mt-1">{errors.age}</p>}
          </Field>

          <Field label="Experience" required>
            <Select value={form.yearsExperience} onChange={set('yearsExperience')}>
              <option value="">Select</option>
              {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
            {errors.yearsExperience && <p className="text-xs text-red-400 mt-1">{errors.yearsExperience}</p>}
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

        <Field label="Primary Subject" required>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(s => (
              <ChoiceButton key={s} selected={form.subject === s} onClick={() => setForm(f => ({ ...f, subject: s }))}>
                {s}
              </ChoiceButton>
            ))}
          </div>
          {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject}</p>}
        </Field>

        {/* School section */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Your School</p>

          <Field label="School Name" required>
            <Input value={form.schoolName} onChange={set('schoolName')} placeholder="e.g. Kendriya Vidyalaya" />
            {errors.schoolName && <p className="text-xs text-red-400 mt-1">{errors.schoolName}</p>}
          </Field>

          <Field label="School Address" hint="Optional — helps identify the exact branch" className="mt-4">
            <Input value={form.schoolAddress} onChange={set('schoolAddress')} placeholder="Street address or landmark" />
          </Field>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="City" required>
              <Input value={form.city} onChange={set('city')} placeholder="e.g. Chennai" />
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

          <Field label="Board" required className="mt-4">
            <div className="flex flex-wrap gap-2">
              {BOARDS.map(b => (
                <ChoiceButton key={b} selected={form.board === b} onClick={() => setForm(f => ({ ...f, board: b }))}>
                  {b}
                </ChoiceButton>
              ))}
            </div>
            {errors.board && <p className="text-xs text-red-400 mt-1">{errors.board}</p>}
          </Field>
        </div>

        <div className="pt-2">
          <NextButton onClick={handleContinue}>
            Find school & continue →
          </NextButton>
        </div>
      </div>
    </StepShell>
  )
}
