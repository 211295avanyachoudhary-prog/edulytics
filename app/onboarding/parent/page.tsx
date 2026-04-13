'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboarding } from '@/hooks/useOnboarding'
import { BOARDS } from '@/lib/schools'
import { INDIAN_STATES } from '@/lib/utils'
import StepShell from '../StepShell'
import { Field, Input, Select, NextButton, ChoiceButton, Textarea } from '../FormParts'
import { cn } from '@/lib/utils'

const GRADES = ['Nursery', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)]
const GENDERS = ['Male', 'Female', 'Other']

const satisfactionOptions = [
  { value: 'yes', emoji: '😊', label: 'Yes, very happy', color: 'border-emerald-400/50 bg-emerald-500/15' },
  { value: 'neutral', emoji: '😐', label: 'Somewhat satisfied', color: 'border-amber-400/50 bg-amber-500/15' },
  { value: 'no', emoji: '😟', label: 'Not satisfied', color: 'border-red-400/50 bg-red-500/15' },
]

export default function ParentInfoPage() {
  const router = useRouter()
  const { state, setParentInfo } = useOnboarding()
  const [form, setForm] = useState(state.parentInfo)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.parentName.trim()) e.parentName = 'Your name is required'
    if (!form.childName.trim()) e.childName = "Child's name is required"
    if (!form.childAge || +form.childAge < 3 || +form.childAge > 20) e.childAge = 'Enter a valid age (3–20)'
    if (!form.childGender) e.childGender = 'Please select gender'
    if (!form.grade) e.grade = 'Please select grade'
    if (!form.schoolName.trim()) e.schoolName = 'School name is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'State is required'
    if (!form.board) e.board = 'Board is required'
    if (!form.happyWithSchool) e.happyWithSchool = 'Please share your satisfaction level'
    return e
  }

  const handleContinue = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setParentInfo(form)
    router.push('/onboarding/review-school')
  }

  return (
    <StepShell
      step={3}
      totalSteps={4}
      emoji="👨‍👩‍👧"
      title="Tell us about your child"
      subtitle="Your perspective as a parent is invaluable for other families making school decisions."
      onBack={() => router.push('/onboarding')}
    >
      <div className="space-y-4">
        {/* Parent info */}
        <Field label="Your Name" required>
          <Input value={form.parentName} onChange={set('parentName')} placeholder="Your full name" />
          {errors.parentName && <p className="text-xs text-red-400 mt-1">{errors.parentName}</p>}
        </Field>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">About Your Child</p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Child's Name" required className="col-span-2">
              <Input value={form.childName} onChange={set('childName')} placeholder="Child's full name" />
              {errors.childName && <p className="text-xs text-red-400 mt-1">{errors.childName}</p>}
            </Field>

            <Field label="Child's Age" required>
              <Input type="number" value={form.childAge} onChange={set('childAge')} placeholder="e.g. 12" min={3} max={20} />
              {errors.childAge && <p className="text-xs text-red-400 mt-1">{errors.childAge}</p>}
            </Field>

            <Field label="Grade / Class" required>
              <Select value={form.grade} onChange={set('grade')}>
                <option value="">Select grade</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
              {errors.grade && <p className="text-xs text-red-400 mt-1">{errors.grade}</p>}
            </Field>
          </div>

          <Field label="Child's Gender" required className="mt-4">
            <div className="flex gap-2">
              {GENDERS.map(g => (
                <ChoiceButton key={g} selected={form.childGender === g} onClick={() => setForm(f => ({ ...f, childGender: g }))}>
                  {g}
                </ChoiceButton>
              ))}
            </div>
            {errors.childGender && <p className="text-xs text-red-400 mt-1">{errors.childGender}</p>}
          </Field>
        </div>

        {/* School info */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-4">Child's School</p>

          <Field label="School Name" required>
            <Input value={form.schoolName} onChange={set('schoolName')} placeholder="e.g. St. Mary's School" />
            {errors.schoolName && <p className="text-xs text-red-400 mt-1">{errors.schoolName}</p>}
          </Field>

          <Field label="School Address" hint="Optional — helps identify the exact branch" className="mt-4">
            <Input value={form.schoolAddress} onChange={set('schoolAddress')} placeholder="e.g. 14 Civil Lines" />
          </Field>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="City" required>
              <Input value={form.city} onChange={set('city')} placeholder="e.g. Mumbai" />
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

        {/* Satisfaction */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Your Satisfaction</p>
          <p className="text-white/70 text-sm mb-4">
            Overall, are you happy with the school your child attends?
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {satisfactionOptions.map(({ value, emoji, label, color }) => (
              <motion.button
                key={value}
                type="button"
                onClick={() => setForm(f => ({ ...f, happyWithSchool: value }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all',
                  form.happyWithSchool === value ? color : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs text-white/70 text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
          {errors.happyWithSchool && <p className="text-xs text-red-400">{errors.happyWithSchool}</p>}

          <AnimatePresence>
            {form.happyWithSchool === 'no' || form.happyWithSchool === 'neutral' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Field label="What are your main concerns?" hint="This helps future parents understand the reality">
                  <Textarea
                    value={form.concerns}
                    onChange={set('concerns')}
                    rows={3}
                    placeholder="e.g. Too much homework, teachers don't explain doubts well..."
                  />
                </Field>
              </motion.div>
            ) : null}
          </AnimatePresence>
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
